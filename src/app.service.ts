import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './models/user';

const LINE_REGEX = /(?:\r?\n|\r)/;
const NUMERIC_REGEX = /^[-+]?\d+([.]\d+)?$/;

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly db: DataSource) {}

  convertToJson(csv: string, separator = ',') {
    const json: Array<Record<string, any>> = [];
    const headers: Array<string> = [];

    console.time('Conversion');
    csv.split(LINE_REGEX).forEach((row, i) => {
      if (i === 0) {
        headers.push(
          ...(this.getCellsFromRow(row, false, separator) as Array<string>),
        );
        return;
      }

      row = row.trim();
      if (row.length === 0) {
        // skip empty rows
        return;
      }

      const values = this.getCellsFromRow(row, true, separator);

      if (headers.length != values.length) {
        throw `Row ${i} is malformed`;
      }

      const record: Record<string, any> = {};
      let hasValue = false;
      values.forEach((v, i) => {
        if (v === null) return;

        hasValue = true;
        const key = headers[i];
        if (key.includes('.')) {
          let finalRecord = record;
          const nested = key.split('.');
          const last = nested.length - 1;
          nested.forEach((k, j) => {
            if (j < last) {
              if (!Object.prototype.hasOwnProperty.call(finalRecord, k)) {
                finalRecord[k] = {};
              }
              finalRecord = finalRecord[k];
            } else {
              finalRecord[k] = v;
            }
          });
        } else {
          record[key] = v;
        }
      });

      if (hasValue) {
        json.push(record);
      }
    });

    console.timeEnd('Conversion');
    this.logger.debug(`Converted ${json.length} records`);

    return json;
  }

  getCellsFromRow(row: string, tryConvert = true, separator = ',') {
    return row.split(separator).map((v) => {
      v = v.trim();
      if (tryConvert) {
        if (v === '') {
          return null;
        }
        if (NUMERIC_REGEX.test(v)) {
          return Number(v);
        }
      }
      return v;
    });
  }

  async insertRowsIntoDatabase(rows: Array<Record<string, any>>) {
    const partialInserts = rows.map((record) => {
      record.name = [record.name.firstName, record.name.lastName]
        .filter((n) => n !== null && n !== undefined)
        .join(' ');
      Object.entries(record).forEach(([k, v]) => {
        if (!['name', 'age', 'address'].includes(k)) {
          record.additional_info = record.additional_info || {};
          record.additional_info[k] = v;
        }
      });

      return record;
    });

    // TODO: move the following to an async queue, ex. bull
    console.time('Transaction');
    let count = 0;
    const batchSize = 5000;

    await this.db.manager.transaction(async (manager) => {
      for (let i = 0; i < partialInserts.length; i += batchSize) {
        const batchNum = i / batchSize + 1;
        console.time(`Insert batch ${batchNum}`);
        count += (
          await manager.insert(User, partialInserts.slice(i, i + batchSize))
        ).identifiers.length;
        console.timeEnd(`Insert batch ${batchNum}`);
      }
    });

    console.timeEnd('Transaction');
    this.logger.debug(`Inserted ${partialInserts.length} records`);

    return count;
  }

  async printAgeDistribution() {
    const results: Record<string, number> = (
      await this.db
        .createQueryBuilder()
        .addSelect(`SUM(CASE WHEN age < 20 THEN 1 ELSE 0 end) "< 20"`)
        .addSelect(
          `SUM(CASE WHEN age >= 20 AND age < 40 THEN 1 ELSE 0 end) "20 to 40"`,
        )
        .addSelect(
          `SUM(CASE WHEN age >= 40 AND age < 60 THEN 1 ELSE 0 end) "40 to 60"`,
        )
        .addSelect(`SUM(CASE WHEN age >= 60 THEN 1 ELSE 0 end) ">= 60"`)
        .from(User, 'user')
        .execute()
    )[0];
    const total = Object.values(results).reduce((p, c) => p + Number(c), 0);
    console.table(
      Object.entries(results).map(([k, v]) => ({
        'Age-Group': k,
        '% Distribution': total > 0 ? Math.round((Number(v) / total) * 100) : 0,
      })),
    );
  }
}
