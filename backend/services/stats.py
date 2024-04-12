import datetime

from pymongo.collection import Collection

from services.main import AppService


def date_range(period: int):
    end_date = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
    start_date = (
        datetime.datetime.utcnow() - datetime.timedelta(days=period - 1)
    ).replace(microsecond=0).isoformat() + "Z"
    return start_date, end_date


class StatsService(AppService):
    def __init__(self):
        super().__init__()
        self.collection: Collection = self.mongo.db["test_runs"]

    def test_runs_total_data(self, period):
        start_date, end_date = date_range(period)
        pipeline = [
            {"$match": {"startedAt": {"$gte": start_date, "$lte": end_date}}},
            {
                "$group": {
                    "_id": None,
                    "totalTests": {"$sum": "$testsCount"},
                    "totalPassed": {"$sum": "$passed"},
                    "totalFailed": {"$sum": "$failed"},
                    "totalSkipped": {"$sum": "$skipped"},
                }
            },
        ]
        result = list(self.collection.aggregate(pipeline))
        if result:
            return result[0]
        return {
            "totalTests": 0,
            "totalPassed": 0,
            "totalFailed": 0,
            "totalSkipped": 0,
        }

    def get_trend(self, period):
        start_date, end_date = date_range(period)
        start_date = (datetime.datetime.strptime(start_date, "%Y-%m-%dT%H:%M:%SZ")
                      .replace(hour=0, minute=0, second=0)
                      .strftime("%Y-%m-%dT%H:%M:%SZ"))
        pipeline = [
            {"$match": {"startedAt": {"$gte": start_date, "$lte": end_date}}},
            {
                "$addFields": {
                    "day": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": {"$toDate": "$startedAt"},
                        }
                    }
                }
            },
            {
                "$group": {
                    "_id": "$day",
                    "totalTests": {"$sum": "$testsCount"},
                    "totalPassed": {"$sum": "$passed"},
                    "totalFailed": {"$sum": "$failed"},
                    "totalSkipped": {"$sum": "$skipped"},
                }
            },
            {
                "$project": {
                    "day": "$_id",
                    "totalTests": 1,
                    "totalPassed": 1,
                    "totalFailed": 1,
                    "totalSkipped": 1,
                    "_id": 0,
                }
            },
        ]
        result = list(self.collection.aggregate(pipeline))
        sorted_result = sorted(result, key=lambda x: x["day"])

        results_by_day = {item["day"]: item for item in sorted_result}

        all_days = [
            (
                datetime.datetime.strptime(start_date, "%Y-%m-%dT%H:%M:%SZ")
                + datetime.timedelta(days=i)
            ).strftime("%Y-%m-%d")
            for i in range(period)
        ]

        final_result = []

        for day in all_days:
            day_data = results_by_day.get(
                day, {"day": day, "totalPassed": 0, "totalFailed": 0, "totalSkipped": 0}
            )
            final_result.append(day_data)

        return {
            "passed": [item["totalPassed"] for item in final_result],
            "failed": [item["totalFailed"] for item in final_result],
            "skipped": [item["totalSkipped"] for item in final_result],
        }
