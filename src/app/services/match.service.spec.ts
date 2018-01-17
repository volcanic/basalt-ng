/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {MatchService} from "./match.service";
import {Skill} from "../model/skill.model";
import {Employee} from "../model/employee.model";

describe('MatchService', () => {
  let skillJavaEE: Skill = {
    "primary": false,
    "category": 7,
    "name": "Java EE (J2EE)",
    "proficiency": {
      "level": 0.1,
      "ownLevel": 1
    },
    "yearsOfExperience": 0,
    "lastYearUsed": 0,
    "skillScore": 0.305,
    "id": "01106037",
    "parentID": "01102877",
    "ancestry": ["Products", "Oracle", "Oracle JAVA/J2EE"]
  };

  let skillSAPR3: Skill = {
    "primary": false,
    "category": 7,
    "name": "SAP R/3 LSMW Legacy Migration Workbench",
    "proficiency": {
      "level": 0.1,
      "ownLevel": 1
    },
    "yearsOfExperience": 0,
    "lastYearUsed": 0,
    "skillScore": 0.305,
    "id": "01105763",
    "parentID": "01102871",
    "ancestry": ["Products", "SAP", "SAP Development"]
  };

  let skillOracle10G: Skill = {
    "primary": false,
    "category": 7,
    "name": "Oracle 10G",
    "proficiency": {
      "level": 0.1,
      "ownLevel": 1
    },
    "yearsOfExperience": 0,
    "lastYearUsed": 0,
    "id": "01106073",
    "parentID": "01102878",
    "skillScore": 0.06931448431551465,
    "ancestry": [
      "Products",
      "Oracle",
      "Oracle Products",
      "Oracle 10G"
    ]
  };

  let employeeWithLanguages: Employee = {
    "skills": [
      {
        "primary": false,
        "category": 4,
        "name": "German",
        "proficiency": {
          "level": 0.8,
          "ownLevel": 4
        },
        "yearsOfExperience": 0,
        "lastYearUsed": 0,
        "id": "0",
        "parentID": "0",
        "skillScore": 0,
        "ancestry": []
      },
      {
        "primary": false,
        "category": 4,
        "name": "English",
        "proficiency": {
          "level": 0.8,
          "ownLevel": 4
        },
        "yearsOfExperience": 0,
        "lastYearUsed": 0,
        "id": "0",
        "parentID": "0",
        "skillScore": 0,
        "ancestry": []
      },
      {
        "primary": false,
        "category": 4,
        "name": "Portuguese",
        "proficiency": {
          "level": 0.8,
          "ownLevel": 4
        },
        "yearsOfExperience": 0,
        "lastYearUsed": 0,
        "id": "0",
        "parentID": "0",
        "skillScore": 0,
        "ancestry": []
      },
      {
        "primary": false,
        "category": 4,
        "name": "Spanish",
        "proficiency": {
          "level": 0.8,
          "ownLevel": 4
        },
        "yearsOfExperience": 0,
        "lastYearUsed": 0,
        "id": "0",
        "parentID": "0",
        "skillScore": 0,
        "ancestry": []
      }
    ],
    "location": "Berlin",
    "mobility": 0,
    "availability": 100,
    "availableFrom": null,
    "wfmJobTitle": "",
    "managerName": "",
    "managerID": "",
    "managerMail": "",
    "cgmLevel": "",
    "costRate": 100,
    "role": "",
    "businessUnit": "",
    "legalEntity": "",
    "id": ""
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchService]
    });
  });

  it('should ...', inject([MatchService], (service: MatchService) => {
    expect(service).toBeTruthy();
  }));

  it('match skill Java EE itself', () => {
    expect(MatchService.skillMatchesSingleItem(skillJavaEE, "Java")).toBeTruthy();
  });

  it('match skill Java EE parent', () => {
    expect(MatchService.skillMatchesSingleItem(skillJavaEE, "Oracle")).toBeTruthy();
  });

  it('match skill SAP R/3 parent', () => {
    expect(MatchService.skillMatchesSingleItem(skillSAPR3, "dev")).toBeTruthy();
  });

  it('match skill Oracle 10G', () => {
    expect(MatchService.skillMatchesSingleItem(skillOracle10G, "oracle")).toBeTruthy();
  });

  fit('match employee with languages', () => {
    expect(MatchService.employeeMatchesLanguages(employeeWithLanguages, ["German"])).toBeTruthy();
  });
});
