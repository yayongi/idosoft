function createCodeInfo(id, code_id, code_name,
  code_level, upper_code, code_dc, reg_datetime, upd_datetime,
  reg_id, upd_id, note, temp_colum){
  const info={
    "id": id,
    "code_id": code_id,
    "code_name": code_name,
    "code_level": code_level,
    "upper_code": upper_code,
    "code_dc":code_dc,
    "reg_datetime": reg_datetime,
    "upd_datetime": upd_datetime,
    "reg_id": reg_id,
    "upd_id": upd_id,
    "note": note,
    "temp_colum": temp_colum
  };
  return info;
}

function getCodeInfoDB() {
    var i=0;
    const array=[];
    console.log("createCodeInfo");
    //test
    array.push(createCodeInfo(i=i+1, "test", "test", "3", "DG0002", "test", "20200318", "", "2017041701", "", "", ""));
    /* 
    array.push(createCodeInfo(i=i+1, "test", "test", "4", "CD0005", "test", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "test1", "test1", "5", "CD0001", "test", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "test2", "test2", "5", "CD0003", "test", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "test2", "test2", "5", "CD0002", "test", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "test2", "test2", "5", "CD0004", "test", "20200318", "", "2017041701", "", "", "")); */

    //최상위
    array.push(createCodeInfo(i=i+1, "CD0000", "직급", "1", "", "직급최상위", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "CD0001", "학위", "1", "", "학위최상위", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "CD0002", "경비유형", "1", "", "경비유형최상위", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "CD0003", "결재상태", "1", "", "결재상태최상위", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "CD0004", "자원종류", "1", "", "자원종류최상위", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "CD0005", "제조사", "1", "", "제조사최상위", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "CD0006", "화면사이즈", "1", "", "화면사이즈최상위", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "CD0007", "게시판타입", "1", "", "게시판타입최상위", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "CD0008", "프로젝트 발주처 코드", "1", "", "프로젝트 발주처 코드최상위", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "CD0009", "역할코드", "1", "", "역할코드최상위", "20200318", "", "2017041701", "", "", ""));
    //직급
    array.push(createCodeInfo(i=i+1, "RK0000", "대표", "2", "CD0000", "직급(대표)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "RK0001", "이사", "2", "CD0000", "직급(이사)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "RK0002", "부장", "2", "CD0000", "직급(부장)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "RK0003", "차장", "2", "CD0000", "직급(차장)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "RK0004", "과장", "2", "CD0000", "직급(과장)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "RK0005", "대리", "2", "CD0000", "직급(대리)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "RK0006", "사원", "2", "CD0000", "직급(사원)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "RK0007", "인턴", "2", "CD0000", "직급(인턴)", "20200318", "", "2017041701", "", "", ""));
    
    //학위
    array.push(createCodeInfo(i=i+1, "DG0000", "중졸", "2", "CD0001", "학위(중졸)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "DG0001", "고졸", "2", "CD0001", "학위(고졸)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "DG0002", "전문학사", "2", "CD0001", "학위(전문학사)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "DG0003", "학사", "2", "CD0001", "학위(학사)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "DG0004", "석사", "2", "CD0001", "학위(석사)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "DG0005", "박사", "2", "CD0001", "학위(박사)", "20200318", "", "2017041701", "", "", ""));
    
    //경비유형코드
    array.push(createCodeInfo(i=i+1, "ET0000", "야식비", "2", "CD0002", "경비유형(야식)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "ET0001", "택시비", "2", "CD0002", "경비유형(택시)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "ET0002", "숙박비", "2", "CD0002", "경비유형(숙박)", "20200318", "", "2017041701", "", "", ""));
    
    //결재상태
    array.push(createCodeInfo(i=i+1, "SS0000", "등록", "2", "CD0003", "결재상태(등록)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "SS0001", "승인", "2", "CD0003", "결재상태(승인)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "SS0002", "완료", "2", "CD0003", "결재상태(완료)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "SS0003", "반려", "2", "CD0003", "결재상태(반려)", "20200318", "", "2017041701", "", "", ""));
    
    //자원종류
    array.push(createCodeInfo(i=i+1, "RE0000", "모니터", "2", "CD0004", "자원종류(모니터)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "RE0001", "노트북", "2", "CD0004", "자원종류(노트북)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "RE0002", "테스트폰", "2", "CD0004", "자원종류(테스트폰)", "20200318", "", "2017041701", "", "", ""));
    
    //제조사
    array.push(createCodeInfo(i=i+1, "MA0000", "삼성", "2", "CD0005", "제조사(삼성)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "MA0001", "LG", "2", "CD0005", "제조사(LG)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "MA0002", "APPLE", "2", "CD0005", "제조사(APPLE)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "MA0003", "HP", "2", "CD0005", "제조사(HP)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "MA0004", "DELL", "2", "CD0005", "제조사(DELL)", "20200318", "", "2017041701", "", "", ""));
    
    //프로젝트 발주처 코드
    array.push(createCodeInfo(i=i+1, "PS0000", "농협", "2", "CD0008", "프로젝트 발주처 코드(농협)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "PS0001", "기업", "2", "CD0008", "프로젝트 발주처 코드(기업)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "PS0002", "우리", "2", "CD0008", "프로젝트 발주처 코드(우리)", "20200318", "", "2017041701", "", "", ""));
    
    //역할코드
    array.push(createCodeInfo(i=i+1, "RL0000", "PM", "2", "CD0009", "역할코드(PM)", "20200318", "", "2017041701", "", "", ""));
    array.push(createCodeInfo(i=i+1, "RL0001", "개발", "2", "CD0009", "역할코드(개발)", "20200318", "", "2017041701", "", "", ""));
    return array;
} 

export {getCodeInfoDB}