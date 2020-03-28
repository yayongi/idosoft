package kr.co.idosoft.intranet.member.model.dao;

import java.util.HashMap;
import java.util.List;

import kr.co.idosoft.intranet.member.vo.MemberVO;

public interface MemberDao {
	// 사원 리스트 호출
	public List<Object> selectMemberList();
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
	// 이메일 중복검사
	public int checkemail(String email);
}
