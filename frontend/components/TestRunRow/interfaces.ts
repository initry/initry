export interface TestRunInterface {
  id: number;
  status: string;
  created_at: string;
  name: string;
  tests: number;
  failed: number;
  errors: number;
  skipped: number;
  stopped_at: string | undefined;
  time: string | undefined;
}
