import { NEXT_PUBLIC_SNOWFLAKE_DATE } from '../env/client.ts'
import { Snowflake } from '@sapphire/snowflake'

export class SnowFlakeGenerator {
    #instance: Snowflake

    constructor() {
        this.#instance = new Snowflake(new Date(NEXT_PUBLIC_SNOWFLAKE_DATE))
        this.#instance.processId = 1
    }

    generate() {
        return this.#instance.generate().toString()
    }
}
