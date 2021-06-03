const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000
const fetch = require('node-fetch');

app.use(
	express.urlencoded({
	  extended: true
	})
  )
  
  app.use(express.json())

// const BASE_URL = 'https://af-erp.ifs.cloud:48080/main/ifsapplications/projection/v1'; // prod
const BASE_URL = 'https://af-erp-test.ifs.cloud:48080/main/ifsapplications/projection/v1'; // test

let cookie = 'XSRF-TOKEN=0PMF-77D7-AM2J-JR0U-LEWR-069B-VVLQ-UD6V; IFSSESSIONID48080=axrRf87p5jpDJFq0vbs8_dqmEmRXD9ljFXfM24M5-jqIlK1DqzFW!-1231247630; _WL_AUTHCOOKIE_IFSSESSIONID48080=DOMgQ9l.Ac4bTGEmN-zi';
let token = '0PMF-77D7-AM2J-JR0U-LEWR-069B-VVLQ-UD6V';



let companyNr = '';
let employeeNr = 0;
let personName = '';

const postBody = {"SourcePage":"TIME_REGISTRATION_JOB","AttInterval":false,"AttResult":false,"AttAbsence":false,"AttLunchBreak":false,"AttChangeIntervals":false,"AttInOutOrg":false,"AttGrossInterval":false,"AttManresult":false,"AttIndirectClock":false,"AttShopClock":false,"AttIndirect":false,"AttShpord":false,"AttWo":false,"AttPrjrep":true,"CompanyId":"600","EmpNo":"492614","AccountDateDate":"2021-05-31","AccountDateTime":"2021-06-04T08:00:00Z","WageClass":"WC1","InTime":"2021-06-04T08:00:00Z","OutTime":null,"InPersClass":"Normal","OutPersClass":null,"InRegType":"Manually","OutRegType":"Manually","AbsenceInTime":"2021-06-04T08:00:00Z","AbsenceOutTime":null,"AbsenceWageCode":"","BreakInTime":"2021-06-04T12:00:00Z","BreakOutTime":"2021-06-04T13:00:00Z","BreakType":"Lunch","WageGrp":null,"WageCode":null,"ManRsltWageCode":null,"ManRsltWageGrp":null,"OrgCode":"600-0091","Objid1":null,"Objid2":null,"Objid3":null,"Objid4":null,"Objid5":null,"DayIn1":null,"DayIn2":null,"DayIn3":null,"DayIn4":null,"DayIn5":null,"DayInType1":null,"DayInType2":null,"DayInType3":null,"DayInType4":null,"DayInType5":null,"DayOut1":null,"DayOut2":null,"DayOut3":null,"DayOut4":null,"DayOut5":null,"DayOutType1":null,"DayOutType2":null,"DayOutType3":null,"DayOutType4":null,"DayOutType5":null,"WageGrpRsltUpd1":null,"WageGrpRsltUpd2":null,"WageGrpRsltUpd3":null,"WageGrpRsltUpd4":null,"WageGrpRsltUpd5":null,"WageCodeRsltUpd1":null,"WageCodeRsltUpd2":null,"WageCodeRsltUpd3":null,"WageCodeRsltUpd4":null,"WageCodeRsltUpd5":null,"OrgCodeUpdate1":null,"OrgCodeUpdate2":null,"OrgCodeUpdate3":null,"OrgCodeUpdate4":null,"OrgCodeUpdate5":null,"ProcStatusUpdate1":null,"ProcStatusUpdate2":null,"ProcStatusUpdate3":null,"ProcStatusUpdate4":null,"ProcStatusUpdate5":null,"RowProtectionUpdate1":false,"RowProtectionUpdate2":false,"RowProtectionUpdate3":false,"RowProtectionUpdate4":false,"RowProtectionUpdate5":false,"WageHours":"8","RowProtection":false,"ResRowProtection":false,"ProcStatus":"IncrementsIncluded","ShortName":"600NC0137.ADM.NCADM_100","ReportCostCode":"TIMENB","PurchaseOrderNo":null,"PurchaseOrderLine":null,"ResourceId":"492614","PriceAdjustmentId":null,"CustomerCompanyId":null,"CustomerActShortName":null,"CustomerActReportCode":null,"Contract":null,"WorkOrder":null,"WorkTask":null,"MaintOrg":null,"CraftId":null,"WoTimeType":null,"PlanLineNo":null,"IndirectJob":null,"Operation":null,"TimeType":null,"DayHours":"8","InternalComments":null,"InvoiceComments":null,"AddShortcut":false,"OrderNo":null,"ReleaseNo":null,"SequenceNo":null,"OperationNo":null,"TeamId":null,"ClockingNoteText":null,"WorkCenterNo":null,"ResourceShare":null,"CrewSize":null,"SetupCrewSize":null,"TimmanTimeBase":"1","JobTransactionParams":{},"ShortcutName":null,"CTaskId":null};

const ifsGet = (res, url, callback) => {
 fetch(url, {
	    headers: {
			cookie
		}

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

const ifsPost = (url, bodyObject, callback) => {
	fetch(BASE_URL + url, {
		headers: {
			cookie,			
			'X-XSRF-TOKEN': token,
			'Content-Type': 'application/json;IEEE754Compatible=true',
			'Accept': 'application/json;odata.metadata=full;IEEE754Compatible=true'
		},
		method: 'POST',
		body: JSON.stringify(bodyObject)
	})
	.then(res => res.json())
	.then(data => {
		console.log({ok: data});
		if(callback) {
			callback(data);
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
app.post('/report', function (req, res) {

	const post = req.body;
	
	const post2 = [
		{date: '2021-05-31', hours: "8"},
		{date: '2021-06-01', hours: "8"},
		// {date: '2021-06-02', hours: "3"},
		// {date: '2021-06-03', hours: "4"},
		// {date: '2021-06-04', hours: "5"},
	];

	let requestCount = post.length;


	post.forEach(day => {
		postBody.AccountDateDate = day.date;
		postBody.DayHours = day.hours;
		ifsPost('/TimeRegistrationEmployeeHandling.svc/ReportTimeWithIntervals', postBody, () => {
			requestCount--;
			if(requestCount == 0)  {
				ifsPost(
					'/TimeRegistrationEmployeeHandling.svc/DoConfirm', 
					{"CompanyId":"600","EmpNo":"492614","StartDate":"2021-05-31","EndDate":"2021-06-06","CheckPhcDays":true},
				);
			}
		});
	});
	res.send({status: "ok" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
