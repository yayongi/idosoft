
//project
function createProjectInfo(project_no, project_nm, instt_code, bgnde, endde, pm, transport_ct, reg_datetime, upd_datetime, reg_id, upd_id, note, temp_colum){
  const info={
	"project_no":project_no,
	"project_nm":project_nm,
	"instt_code":instt_code,
	"bgnde":bgnde,
	"endde":endde,
	"pm":pm,
	"transport_ct":transport_ct,
	"reg_datetime":reg_datetime,
	"upd_datetime":upd_datetime,
	"reg_id":reg_id,
	"upd_id":upd_id,
	"note":note,
	"temp_colum":temp_colum,
  };
  return info;
}

function getProjectInfoDB() {
    var i=0;
    const array=[];
    console.log("getProjectInfoDB");
    //project_no, project_nm, instt_code, bgnde, endde, pm, transport_ct, reg_datetime, upd_datetime, reg_id, upd_id, note, temp_colum
    array.push(createProjectInfo(i=i+1, "콕뱅크4차고도화", "PS0000", "20190601", "20191212", "0000000001", "5000", "20190601", "", "0000000001", "", "", ""));
    //array.push(createProjectInfo(i=i+1, "콕뱅크4차고도화", "PS0000", "20190601", "20191212", "2017041701", "5000", "20190601", "", "", "", "", ""));
    //array.push(createProjectInfo(i=i+1, "콕뱅크4차고도화", "PS0000", "20190601", "20191212", "2018060102", "5000", "20190601", "", "", "", "", ""));
    //array.push(createProjectInfo(i=i+1, "콕뱅크4차고도화", "PS0000", "20190601", "20191212", "2019060101", "5000", "20190601", "", "", "", "", ""));
    
    array.push(createProjectInfo(i=i+1, "올원뱅크4차고도화", "PS0000", "20190613", "20200120", "0000000003", "5000", "20190613", "", "0000000003", "", "", ""));
    //array.push(createProjectInfo(i=i+1, "올원뱅크4차고도화", "PS0000", "20190613", "20200120", "2018060101", "5000", "20190613", "", "", "", "", ""));
    
    array.push(createProjectInfo(i=i+1, "콕뱅크상시", "PS0000", "20200301", "20200330", "0000000003", "0", "20200301", "", "0000000003", "", "", ""));
    //array.push(createProjectInfo(i=i+1, "콕뱅크상시", "PS0000", "20200301", "20200330", "2017041701", "0", "20200301", "", "", "", "", ""));
    //array.push(createProjectInfo(i=i+1, "콕뱅크상시", "PS0000", "20200301", "20200330", "2018060101", "0", "20200301", "", "", "", "", ""));
    //array.push(createProjectInfo(i=i+1, "콕뱅크상시", "PS0000", "20200301", "20200330", "2018060102", "0", "20200301", "", "", "", "", ""));
    //array.push(createProjectInfo(i=i+1, "콕뱅크상시", "PS0000", "20200301", "20200330", "2019060101", "0", "20200301", "", "", "", "", ""));
    
    array.push(createProjectInfo(i=i+1, "기업은행상시", "PS0001", "20200101", "20200820", "0000000002", "0", "20200101", "", "0000000002", "", "", ""));
    //array.push(createProjectInfo(i=i+1, "기업은행상시", "PS0001", "20200101", "20200820", "2017041702", "0", "20200101", "", "", "", "", ""));
    
    array.push(createProjectInfo(i=i+1, "우리은행고도화", "PS0002", "20200103", "20201230", "0000000004", "0", "20200101", "", "0000000004", "", "", ""));
    return array;
}


//member
function createMemberInfo(member_id, member_name, rank){
  const info={
	"member_id":member_id,
	"member_name":member_name,
	"rank":rank
  };
  return info;
}


function getMemberInfoDB() {
    var i=0;
    const array=[];
    console.log("getMemberInfoDB");
    //test
    array.push(createMemberInfo("0000000000", "최문걸", "대표님"));
    array.push(createMemberInfo("0000000001", "조현철", "이사님"));
    array.push(createMemberInfo("0000000002", "이인성", "부장님"));
    array.push(createMemberInfo("0000000003", "오경섭", "차장님"));
    array.push(createMemberInfo("0000000004", "임호영", "과장님"));
    array.push(createMemberInfo("2017041701", "송원회", "대리"));
    array.push(createMemberInfo("2017041702", "임정환", "대리"));
    array.push(createMemberInfo("2018060101", "강성우", "대리"));
    array.push(createMemberInfo("2018060102", "유기환", "사원"));
    array.push(createMemberInfo("2019060101", "김준선", "사원"));
    return array;
}


//site
function createSiteInfo(instt_code, instt_name){
  const info={
	"instt_code":instt_code,
	"instt_name":instt_name,
  };
  return info;
}


function getSiteInfoDB() {
    var i=0;
    const array=[];
    console.log("getSiteInfoDB");
    //test
    array.push(createSiteInfo("PS0000", "농협"));
    array.push(createSiteInfo("PS0001", "기업"));
    array.push(createSiteInfo("PS0002", "우리"));
    return array;
}




export {getProjectInfoDB, getMemberInfoDB, getSiteInfoDB}