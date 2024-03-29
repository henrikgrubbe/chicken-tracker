/* tslint:disable */
/* eslint-disable */
/**
 * chicken-data API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0-SNAPSHOT
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface StatisticsOutput
 */
export interface StatisticsOutput {
    /**
     * 
     * @type {Date}
     * @memberof StatisticsOutput
     */
    from: Date;
    /**
     * 
     * @type {Date}
     * @memberof StatisticsOutput
     */
    to: Date;
    /**
     * 
     * @type {number}
     * @memberof StatisticsOutput
     */
    expenses: number;
    /**
     * 
     * @type {number}
     * @memberof StatisticsOutput
     */
    income: number;
    /**
     * 
     * @type {number}
     * @memberof StatisticsOutput
     */
    saved: number;
    /**
     * 
     * @type {number}
     * @memberof StatisticsOutput
     */
    balance: number;
    /**
     * 
     * @type {number}
     * @memberof StatisticsOutput
     */
    numberOfEggs: number;
    /**
     * 
     * @type {number}
     * @memberof StatisticsOutput
     */
    pricePerEgg: number;
    /**
     * 
     * @type {number}
     * @memberof StatisticsOutput
     */
    priceForNextEgg: number;
    /**
     * 
     * @type {number}
     * @memberof StatisticsOutput
     */
    daysWithChickens: number;
}

/**
 * Check if a given object implements the StatisticsOutput interface.
 */
export function instanceOfStatisticsOutput(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "from" in value;
    isInstance = isInstance && "to" in value;
    isInstance = isInstance && "expenses" in value;
    isInstance = isInstance && "income" in value;
    isInstance = isInstance && "saved" in value;
    isInstance = isInstance && "balance" in value;
    isInstance = isInstance && "numberOfEggs" in value;
    isInstance = isInstance && "pricePerEgg" in value;
    isInstance = isInstance && "priceForNextEgg" in value;
    isInstance = isInstance && "daysWithChickens" in value;

    return isInstance;
}

export function StatisticsOutputFromJSON(json: any): StatisticsOutput {
    return StatisticsOutputFromJSONTyped(json, false);
}

export function StatisticsOutputFromJSONTyped(json: any, ignoreDiscriminator: boolean): StatisticsOutput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'from': json['from'],
        'to': json['to'],
        'expenses': json['expenses'],
        'income': json['income'],
        'saved': json['saved'],
        'balance': json['balance'],
        'numberOfEggs': json['number_of_eggs'],
        'pricePerEgg': json['price_per_egg'],
        'priceForNextEgg': json['price_for_next_egg'],
        'daysWithChickens': json['days_with_chickens'],
    };
}

export function StatisticsOutputToJSON(value?: StatisticsOutput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'from': value.from,
        'to': value.to,
        'expenses': value.expenses,
        'income': value.income,
        'saved': value.saved,
        'balance': value.balance,
        'number_of_eggs': value.numberOfEggs,
        'price_per_egg': value.pricePerEgg,
        'price_for_next_egg': value.priceForNextEgg,
        'days_with_chickens': value.daysWithChickens,
    };
}

