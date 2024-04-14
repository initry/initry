/* tslint:disable */
/* eslint-disable */
/**
 * Initry backend
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import { HTTPValidationError } from '../models';
// @ts-ignore
import { ResponseGettestbyid } from '../models';
// @ts-ignore
import { Test } from '../models';
/**
 * TestsApi - axios parameter creator
 * @export
 */
export const TestsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Get History By Test Id
         * @param {any} testId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getHistoryByTestId: async (testId: any, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'testId' is not null or undefined
            assertParamExists('getHistoryByTestId', 'testId', testId)
            const localVarPath = `/api/tests/{test_id}/history`
                .replace(`{${"test_id"}}`, encodeURIComponent(String(testId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get Test By Id
         * @param {any} testId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getTestById: async (testId: any, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'testId' is not null or undefined
            assertParamExists('getTestById', 'testId', testId)
            const localVarPath = `/api/tests/{test_id}`
                .replace(`{${"test_id"}}`, encodeURIComponent(String(testId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get Tests From Test Run
         * @param {string} testRun 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getTestsFromTestRun: async (testRun: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'testRun' is not null or undefined
            assertParamExists('getTestsFromTestRun', 'testRun', testRun)
            const localVarPath = `/api/tests/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (testRun !== undefined) {
                localVarQueryParameter['test_run'] = testRun;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * TestsApi - functional programming interface
 * @export
 */
export const TestsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = TestsApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Get History By Test Id
         * @param {any} testId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getHistoryByTestId(testId: any, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Test>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getHistoryByTestId(testId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TestsApi.getHistoryByTestId']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get Test By Id
         * @param {any} testId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getTestById(testId: any, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResponseGettestbyid>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getTestById(testId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TestsApi.getTestById']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get Tests From Test Run
         * @param {string} testRun 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getTestsFromTestRun(testRun: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Test>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getTestsFromTestRun(testRun, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TestsApi.getTestsFromTestRun']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * TestsApi - factory interface
 * @export
 */
export const TestsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = TestsApiFp(configuration)
    return {
        /**
         * 
         * @summary Get History By Test Id
         * @param {any} testId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getHistoryByTestId(testId: any, options?: any): AxiosPromise<Array<Test>> {
            return localVarFp.getHistoryByTestId(testId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get Test By Id
         * @param {any} testId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getTestById(testId: any, options?: any): AxiosPromise<ResponseGettestbyid> {
            return localVarFp.getTestById(testId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get Tests From Test Run
         * @param {string} testRun 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getTestsFromTestRun(testRun: string, options?: any): AxiosPromise<Array<Test>> {
            return localVarFp.getTestsFromTestRun(testRun, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * TestsApi - interface
 * @export
 * @interface TestsApi
 */
export interface TestsApiInterface {
    /**
     * 
     * @summary Get History By Test Id
     * @param {any} testId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TestsApiInterface
     */
    getHistoryByTestId(testId: any, options?: RawAxiosRequestConfig): AxiosPromise<Array<Test>>;

    /**
     * 
     * @summary Get Test By Id
     * @param {any} testId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TestsApiInterface
     */
    getTestById(testId: any, options?: RawAxiosRequestConfig): AxiosPromise<ResponseGettestbyid>;

    /**
     * 
     * @summary Get Tests From Test Run
     * @param {string} testRun 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TestsApiInterface
     */
    getTestsFromTestRun(testRun: string, options?: RawAxiosRequestConfig): AxiosPromise<Array<Test>>;

}

/**
 * TestsApi - object-oriented interface
 * @export
 * @class TestsApi
 * @extends {BaseAPI}
 */
export class TestsApi extends BaseAPI implements TestsApiInterface {
    /**
     * 
     * @summary Get History By Test Id
     * @param {any} testId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TestsApi
     */
    public getHistoryByTestId(testId: any, options?: RawAxiosRequestConfig) {
        return TestsApiFp(this.configuration).getHistoryByTestId(testId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get Test By Id
     * @param {any} testId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TestsApi
     */
    public getTestById(testId: any, options?: RawAxiosRequestConfig) {
        return TestsApiFp(this.configuration).getTestById(testId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get Tests From Test Run
     * @param {string} testRun 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TestsApi
     */
    public getTestsFromTestRun(testRun: string, options?: RawAxiosRequestConfig) {
        return TestsApiFp(this.configuration).getTestsFromTestRun(testRun, options).then((request) => request(this.axios, this.basePath));
    }
}

