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


// May contain unused imports in some cases
// @ts-ignore
import { Failed } from './failed';
// May contain unused imports in some cases
// @ts-ignore
import { Passed } from './passed';
// May contain unused imports in some cases
// @ts-ignore
import { Skipped } from './skipped';
// May contain unused imports in some cases
// @ts-ignore
import { Startedat } from './startedat';
// May contain unused imports in some cases
// @ts-ignore
import { Stoppedat } from './stoppedat';

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
     * @type {Startedat}
     * @memberof TestRun
     */
    'startedAt'?: Startedat;
    /**
     * 
     * @type {Stoppedat}
     * @memberof TestRun
     */
    'stoppedAt'?: Stoppedat;
    /**
     * 
     * @type {Passed}
     * @memberof TestRun
     */
    'passed'?: Passed;
    /**
     * 
     * @type {Failed}
     * @memberof TestRun
     */
    'failed'?: Failed;
    /**
     * 
     * @type {Skipped}
     * @memberof TestRun
     */
    'skipped'?: Skipped;
    /**
     * 
     * @type {string}
     * @memberof TestRun
     */
    'pluginType': string;
}

