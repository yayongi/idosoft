package kr.co.idosoft.intranet.member.model.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import kr.co.idosoft.intranet.member.vo.MemberVO;

public interface MemberService {

	// 사원 리스트 호출
	public List<MemberVO> selectMemberList();
	// 사원 정보 호출
	public MemberVO selectMember(String member_no);
	// 사원 정보 등록
	public int registerMember(MemberVO memberInfo);
	// 사원 정보 수정
	public int updateMember(MemberVO memberInfo);
	// 사원 정보 삭제
	public int deleteMember(List<String> member_no_list);
	// 코드 정보 가져오기
	public List<Object> getCodeInfo(String code_id);
	// 생일 가져오기
	public List<String> getBirthDate(HashMap<String, String> date);
	// 결혼기념일 가져오기
	public List<String> getMarriageDate(String date);
	// 이메일 중복 체크
	public int checkemail(MemberVO memberInfo);
	// 동일 연도 사번 검색
	public String findMemberNo(String member_no);
	// 사원정보 엑셀 출력
	public List<LinkedHashMap<String, Object>> exportExcelList(List<MemberVO> memberVoList); 
	// 사원 비밀번호 초기화
	public int initializePassword(MemberVO memberVo);
}
