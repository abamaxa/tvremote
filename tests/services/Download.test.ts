import {describe, expect, test, jest, beforeEach} from '@jest/globals';
import { mock } from 'jest-mock-extended';
import type {RestAdaptor} from "../../src/adaptors/RestAdaptor";
import {TaskManager} from "../../src/services/Task";


test("init", async () => {
  const mockRestAdaptor = mock<RestAdaptor>();
  mockRestAdaptor.get.mockReturnValue(
    new Promise((resolve) => {
      resolve({"results" : [{name: "test name"}]})
    }));

  let dm = new TaskManager(mockRestAdaptor);

  await dm.list((data) => {
    console.log(data);
  });
});



