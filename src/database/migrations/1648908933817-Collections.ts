import {MigrationInterface, QueryRunner, Table } from "typeorm";

export class Collections1648908933817 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "collections",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "token_address",
                    type: "varchar"
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "symbol",
                    type: "varchar"
                },
                {
                    name: "contract_type",
                    type: "varchar"
                },
                {
                    name: "image_url",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "twitter_username",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "discord_url",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "opensea_slug",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "total_supply",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "holders",
                    type: "integer",
                    isNullable: true
                },
                {
                    name: "total_volume",
                    type: "double precision",
                    isNullable: true
                },
                {
                    name: "floor_price",
                    type: "double precision",
                    isNullable: true
                },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("collections");
    }

}
