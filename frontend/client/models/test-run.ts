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



/**
 * 
 * @export
 * @interface TestRun
 */
export interface TestRun {
    /**
     * 
     * @type {string}
     * @memberof TestRun
     */
    'uuid': string;
    /**
     * 
     * @type {number}
     * @memberof TestRun
     */
    'testsCount'?: number;
    /**
     * 
     * @type {string}
     * @memberof TestRun
     */
    'runName': string;
    /**
     * 
     * @type {string}
     * @memberof TestRun
     */
    'startedAt'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TestRun
     */
    'stoppedAt'?: string | null;
    /**
     * 
     * @type {number}
     * @memberof TestRun
     */
    'passed'?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TestRun
     */
    'failed'?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TestRun
     */
    'skipped'?: number | null;
    /**
     * 
     * @type {string}
     * @memberof TestRun
     */
    'pluginType': string;
    /**
     * 
     * @type {string}
     * @memberof TestRun
     */
    'hostName'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TestRun
     */
    'testSuite'?: string | null;
}

