import {
    NEXT_PUBLIC_SNOWFLAKE_DATE,
    NEXT_PUBLIC_SNOWFLAKE_WORKER_ID,
} from '../env/client.ts'
import { Snowflake } from '@sapphire/snowflake'

export class SnowFlakeGenerator {
    #agenciesInstance: Snowflake
    #employeesInstance: Snowflake
    #locationsInstance: Snowflake
    #propertiesInstance: Snowflake
    #zonesInstance: Snowflake
    #categoryInstance: Snowflake
    #conditionInstance: Snowflake

    constructor() {
        this.#agenciesInstance = new Snowflake(
            new Date(NEXT_PUBLIC_SNOWFLAKE_DATE),
        )
        this.#agenciesInstance.workerId = +NEXT_PUBLIC_SNOWFLAKE_WORKER_ID
        this.#agenciesInstance.processId = 1

        this.#employeesInstance = new Snowflake(
            new Date(NEXT_PUBLIC_SNOWFLAKE_DATE),
        )
        this.#employeesInstance.workerId = +NEXT_PUBLIC_SNOWFLAKE_WORKER_ID
        this.#employeesInstance.processId = 2

        this.#locationsInstance = new Snowflake(
            new Date(NEXT_PUBLIC_SNOWFLAKE_DATE),
        )
        this.#locationsInstance.workerId = +NEXT_PUBLIC_SNOWFLAKE_WORKER_ID
        this.#locationsInstance.processId = 3

        this.#propertiesInstance = new Snowflake(
            new Date(NEXT_PUBLIC_SNOWFLAKE_DATE),
        )
        this.#propertiesInstance.workerId = +NEXT_PUBLIC_SNOWFLAKE_WORKER_ID
        this.#propertiesInstance.processId = 5

        this.#zonesInstance = new Snowflake(
            new Date(NEXT_PUBLIC_SNOWFLAKE_DATE),
        )
        this.#zonesInstance.workerId = +NEXT_PUBLIC_SNOWFLAKE_WORKER_ID
        this.#zonesInstance.processId = 6

        this.#categoryInstance = new Snowflake(
            new Date(NEXT_PUBLIC_SNOWFLAKE_DATE),
        )
        this.#categoryInstance.workerId = +NEXT_PUBLIC_SNOWFLAKE_WORKER_ID
        this.#categoryInstance.processId = 7

        this.#conditionInstance = new Snowflake(
            new Date(NEXT_PUBLIC_SNOWFLAKE_DATE),
        )
        this.#conditionInstance.workerId = +NEXT_PUBLIC_SNOWFLAKE_WORKER_ID
        this.#conditionInstance.processId = 8
    }

    generateAgencies() {
        return this.#agenciesInstance.generate().toString()
    }

    generateEmployees() {
        return this.#employeesInstance.generate().toString()
    }

    generateLocations() {
        return this.#locationsInstance.generate().toString()
    }

    generateProperties() {
        return this.#propertiesInstance.generate().toString()
    }

    generateZones() {
        return this.#zonesInstance.generate().toString()
    }

    generateCategory() {
        return this.#categoryInstance.generate().toString()
    }

    generateCondition() {
        return this.#conditionInstance.generate().toString()
    }
}
