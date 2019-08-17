import {inject, TestBed} from '@angular/core/testing';

import {TaskService} from './task.service';
import {EntityProviders} from '../../entity.providers';
import {EntityImports} from '../../entity.imports';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../../persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../persistence/services/pouchdb-settings.service.mock';
import {ProjectService} from '../project/project.service';
import {TagService} from '../tag/tag.service';
import {SuggestionService} from '../suggestion.service';
import {ScopeService} from '../scope.service';
import {Task} from '../../model/task.model';

describe('TaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityImports],
      providers: [
        EntityProviders,
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        ProjectService,
        TagService,
        SuggestionService,
        ScopeService
      ]
    });
  });

  it('should be created', inject([TaskService], (service: TaskService) => {
    expect(service).toBeTruthy();
  }));
});

describe('TaskService.sortTasks()', () => {
  enum parity {
    aOverB ,
    aEqualB,
    bOverA
  }

  function composeTaskPair(dueTimeParity: parity, calculatedStartParity: parity, priorityParity: parity, startBBeforeAIsDue = true, startABeforeBIsDue = true) {
    const taskA = new Task();
    const taskB = new Task();

    /* Initialize default values */
    const currentDate = new Date();
    const dueDateA: Date = currentDate;
    const dueDateB: Date = currentDate;

    const priorityA = 1;
    const priorityB = 1;

    function addMinutes(date, minutes) {
      return new Date(date.getTime() + minutes * 60000);
    }

    /* Adapt tasks according to parities */
    if (dueTimeParity === parity.aOverB) {
      // Add minutes to B
      taskB.dueDate = addMinutes(dueDateB, 30);
    } else if (dueTimeParity === parity.bOverA) {
      // Add minutes to A
      taskA.dueDate = addMinutes(dueDateA, 30);
    } else {
      // Do nothing (Date is same)
    }

    // @ts-ignore
    const dateDiffInMillis = taskA.dueDate - taskB.dueDate;
    const dateDiffInMinutes = Math.abs(dateDiffInMillis) / 1000 / 60;

    if (calculatedStartParity === parity.aOverB) {
      // Effort of A set to > dateDiff between A & B
      taskA.effort = dateDiffInMinutes + 30;
    } else if (calculatedStartParity === parity.bOverA) {
      // Effort of B set to > dateDiff of A & B
      taskB.effort = dateDiffInMinutes + 30;
    } else {
      // Set effort to equalize dateDiff between A & B
      if (dateDiffInMillis > 0) {
        taskA.effort += dateDiffInMinutes;
      } else if (dateDiffInMillis < 0) {
        taskB.effort += dateDiffInMinutes;
      }
    }

    if (priorityParity === parity.aOverB) {
      // Set Priority A < Priority B
      taskA.priority = priorityB - 1;
    } else if (priorityParity === parity.bOverA) {
      // Set Priority B < Priority A
      taskB.priority = priorityA - 1;
    } else {
      // Set priorities to be equal
      taskA.priority = taskB.priority = 1;
    }

    const dueTimeA = new Date(taskA.dueDate).getTime() / 1000 / 60;
    const dueTimeB = new Date(taskB.dueDate).getTime() / 1000 / 60;

    const calculatedStartA = dueTimeA - taskA.effort;
    const calculatedStartB = dueTimeB - taskB.effort;

    if (startBBeforeAIsDue) {
      // Ensure that calculatedStart of B is before DueTime of A
      if (calculatedStartB > dueTimeA) {
        // Calculate difference between startOfB and dueTimeA
        const dueDiff = Math.abs(calculatedStartB - dueTimeA);
        // add that difference + 1 to effort of b
        taskB.effort += dueDiff + 1;
      }
    } else {
      // Ensure that calculatedStart of B is after dueTime of A
      if (calculatedStartB < dueTimeA) {
        // Calculate difference between startOfB and dueTimeA
        const dueDiff = Math.abs(calculatedStartB - dueTimeA);
        // subtract that difference + 1 to effort of B
        taskB.effort -= dueDiff + 1;
      }
    }

    if (startABeforeBIsDue) {
      // Ensure that calculatedStart of A is before DueTime of B
      if (calculatedStartA > dueTimeB) {
        // Calculate difference between startOfA and dueTimeB
        const dueDiff = Math.abs(calculatedStartA - dueTimeB);
        // add that difference + 1 to effort of A
        taskA.effort += dueDiff + 1;
      }
    } else {
      // Ensure that calculatedStart of A is after dueTime of B
      if (calculatedStartA < dueTimeB) {
        // Calculate difference between startOfB and dueTimeA
        const dueDiff = Math.abs(calculatedStartA - dueTimeB);
        // subtract that difference + 1 to effort of B
        taskA.effort -= dueDiff + 1;
      }
    }

    return {
      taskA,
      taskB
    };
  }

  describe('Scenario: dueTimeA before dueTimeB', () => {
    describe('&& calcStartA before calcStartB', () => {
      it('should work for test scenario 1', () => {
        const taskSet = composeTaskPair(
          parity.aOverB,
          parity.aOverB,
          parity.aEqualB,
          false
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 2', () => {
        const taskSet = composeTaskPair(
          parity.aOverB,
          parity.aOverB,
          parity.aOverB,
          false
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 3', () => {
        const taskSet = composeTaskPair(
          parity.aOverB,
          parity.aOverB,
          parity.bOverA,
          false
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 4', () => {
        const taskSet = composeTaskPair(
          parity.aOverB,
          parity.aOverB,
          parity.aEqualB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 5', () => {
        const taskSet = composeTaskPair(
          parity.aOverB,
          parity.aOverB,
          parity.aOverB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 6', () => {
        const taskSet = composeTaskPair(
          parity.aOverB,
          parity.aOverB,
          parity.bOverA
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
    });
    describe('&& calcStartA after calcStartB', () => {
      it('should work for test scenario 7', () => {
        const taskSet = composeTaskPair(
          parity.aOverB,
          parity.bOverA,
          parity.aEqualB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 8', () => {
        const taskSet = composeTaskPair(
          parity.aOverB,
          parity.bOverA,
          parity.aOverB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 9', () => {
        const taskSet = composeTaskPair(
          parity.aOverB,
          parity.bOverA,
          parity.bOverA
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
    });
    describe('&& calcStartA equals calcStartB', () => {
      it('should work for test scenario 10', () => {
        const taskSet = composeTaskPair(
          parity.aOverB,
          parity.aEqualB,
          parity.aEqualB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 11', () => {
        const taskSet = composeTaskPair(
          parity.aOverB,
          parity.aEqualB,
          parity.aOverB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 12', () => {
        const taskSet = composeTaskPair(
          parity.aOverB,
          parity.aEqualB,
          parity.bOverA
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
    });
  });
  describe('Scenario: dueTimeA after dueTimeB', () => {
    describe('&& calcStartA before calcStartB', () => {
      it('should work for test scenario 13', () => {
        const taskSet = composeTaskPair(
          parity.bOverA,
          parity.aOverB,
          parity.aEqualB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
      it('should work for test scenario 14', () => {
        const taskSet = composeTaskPair(
          parity.bOverA,
          parity.aOverB,
          parity.aOverB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 15', () => {
        const taskSet = composeTaskPair(
          parity.bOverA,
          parity.aOverB,
          parity.bOverA
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
    });
    describe('&& calcStartA after calcStartB', () => {
      it('should work for test scenario 16', () => {
        const taskSet = composeTaskPair(
          parity.bOverA,
          parity.bOverA,
          parity.aEqualB,
          true,
          false
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
      it('should work for test scenario 17', () => {
        const taskSet = composeTaskPair(
          parity.bOverA,
          parity.bOverA,
          parity.aOverB,
          true,
          false
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
      it('should work for test scenario 18', () => {
        const taskSet = composeTaskPair(
          parity.bOverA,
          parity.bOverA,
          parity.bOverA,
          true,
          false
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });

      it('should work for test scenario 19', () => {
        const taskSet = composeTaskPair(
          parity.bOverA,
          parity.bOverA,
          parity.aEqualB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
      it('should work for test scenario 20', () => {
        const taskSet = composeTaskPair(
          parity.bOverA,
          parity.bOverA,
          parity.aOverB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 21', () => {
        const taskSet = composeTaskPair(
          parity.bOverA,
          parity.bOverA,
          parity.bOverA
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
    });
    describe('&& calcStartA equals calcStartB', () => {
      it('should work for test scenario 22', () => {
        const taskSet = composeTaskPair(
          parity.bOverA,
          parity.aEqualB,
          parity.aEqualB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
      it('should work for test scenario 23', () => {
        const taskSet = composeTaskPair(
          parity.bOverA,
          parity.aEqualB,
          parity.aOverB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 24', () => {
        const taskSet = composeTaskPair(
          parity.bOverA,
          parity.aEqualB,
          parity.bOverA
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
    });
  });
  describe('Scenario: dueTimeA equals dueTimeB', () => {
    describe('&& calcStartA before calcStartB', () => {
      it('should work for test scenario 25', () => {
        const taskSet = composeTaskPair(
          parity.aEqualB,
          parity.aOverB,
          parity.aEqualB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 26', () => {
        const taskSet = composeTaskPair(
          parity.aEqualB,
          parity.aOverB,
          parity.aOverB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 27', () => {
        const taskSet = composeTaskPair(
          parity.aEqualB,
          parity.aOverB,
          parity.bOverA
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
    });
    describe('&& calcStartA after calcStartB', () => {
      it('should work for test scenario 28', () => {
        const taskSet = composeTaskPair(
          parity.aEqualB,
          parity.bOverA,
          parity.aEqualB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 29', () => {
        const taskSet = composeTaskPair(
          parity.aEqualB,
          parity.bOverA,
          parity.aOverB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 30', () => {
        const taskSet = composeTaskPair(
          parity.aEqualB,
          parity.bOverA,
          parity.bOverA
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
    });
    describe('&& calcStartA equals calcStartB', () => {
      it('should work for test scenario 31', () => {
        const taskSet = composeTaskPair(
          parity.aEqualB,
          parity.aEqualB,
          parity.aEqualB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 32', () => {
        const taskSet = composeTaskPair(
          parity.aEqualB,
          parity.aEqualB,
          parity.aOverB
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(-1);
      });
      it('should work for test scenario 33', () => {
        const taskSet = composeTaskPair(
          parity.aEqualB,
          parity.aEqualB,
          parity.bOverA
        );

        const sortingResult = TaskService.sortTasks(taskSet.taskA, taskSet.taskB);

        expect(sortingResult).toEqual(1);
      });
    });
  });
});
