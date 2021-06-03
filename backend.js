const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000
const fetch = require('node-fetch');

const BASE_URL = 'https://af-erp.ifs.cloud:48080/main/ifsapplications/projection/v1';

let cookie = 'IFSSESSIONID48080=GBTQtTKh8rO0LdW6bbZMLwDKCso04hoDsh0jMncGEJDHn2uCs7aO!1033914911;';

let companyNr = '';
let employeeNr = 0;
let personName = '';

const ifsGet = (res, url, callback) => {
 fetch(url, {
	    headers: {cookie}
	})
    .then(res => res.json())
    .then(data => {
    	if(callback){
    		callback(data);
    	}else {
        	res.send({ data });
        }
    })
    .catch(err => {
        res.send(err);
    });
}

app.get('/me', function (req, res) {
	ifsGet(res, BASE_URL + '/FrameworkServices.svc/GetCSVList()', (data) => {
		employeeNr = data.value.filter(d => d.Name === '#USER_ID#')[0].Value;
		companyNr = data.value.filter(d => d.Name === '#DEFAULT_COMPANY#')[0].Value;
		personName = data.value.filter(d => d.Name === '#PERSON_NAME#')[0].Value;

		res.send({
			companyNr,employeeNr, personName
		});
	});
});

app.get('/time', function (req, res) {
	ifsGet(res, BASE_URL + '/FrameworkServices.svc/GetCSVList()', (data) => {
		employeeNr = data.value.filter(d => d.Name === '#USER_ID#')[0].Value;
		companyNr = data.value.filter(d => d.Name === '#DEFAULT_COMPANY#')[0].Value;
		personName = data.value.filter(d => d.Name === '#PERSON_NAME#')[0].Value;

		ifsGet(res, BASE_URL + "/TimeRegistrationEmployeeHandling.svc/MyEmployees(CompanyId='"+companyNr+"',EmpNo='"+employeeNr+"')/EmpDayInfoSet?$select=AccountDate,CompanyId,DayStatus,EmpNo,IsDeviationDay,IsUser,Notes,PublicHolidayType,RemainingJob,RemainingWage,ScheduleHours,IntervalInfo,DeviationDayType,OrdinaryDayTypeId,ScheduleDayTypeId,WorkSchedHours,EffectiveSchedHours,OrdinaryDayType,OrdinarySchedHours,PublicHolidayDetails,DayCompleted,DayInfoStatus,RemainingJobHrs,RemainingWageHrs,AuthId,AuthLevel,AuthPersonId,AuthStamp,luname,keyref&$filter=AccountDate%20ge%202021-05-24%20and%20AccountDate%20le%202021-05-30&$orderby=AccountDate%20asc");

	});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
