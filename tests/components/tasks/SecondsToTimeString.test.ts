import {test} from "@jest/globals";
import { secondsToTimeString } from "../../../src/services/helpers";

describe('seconds to time string', () => {

  const testCases = [
    {secs: 3599, expected: "59 mins 59 secs"},
    {secs: 3600, expected: "1 hour"},
    {secs: 3611, expected: "1 hour 11 secs"},
    {secs: 21, expected: "21 secs"},
    {secs: 13020, expected: "3 hours 37 mins"},
    {secs: 324000, expected: "3 days 18 hours"},
    {secs: 1, expected: "1 sec"},
    {secs: 0, expected: "unknown"},
    {secs: -1, expected: "unknown"},
    {secs: 172800, expected: "2 days"},
    {secs: 59, expected: "59 secs"},
    {secs: 60, expected: "1 min"},
    {secs: 61, expected: "1 min 1 sec"},
  ]

  for (const testCase of testCases) {
    test(`${testCase.secs} secs to equal ${testCase.expected}`, () => {
      expect(secondsToTimeString(testCase.secs)).toBe(testCase.expected);
    });
  }
});