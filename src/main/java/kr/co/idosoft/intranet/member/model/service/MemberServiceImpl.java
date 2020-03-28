package kr.co.idosoft.intranet.member.model.service;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.member.model.dao.MemberDao;
import kr.co.idosoft.intranet.member.vo.MemberVO;

@Service
public class MemberServiceImpl implements MemberService {
	private static final Logger logger = LoggerFactory.getLogger(MemberServiceImpl.class);
	@Resource MemberDao memberDao;
	
	// 사원 정보 리스트 
	@Override
	public List<Object> selectMemberList() {
		return memberDao.selectMemberList() ;
	}

	// 사원 정보 호출
	@Override
	public MemberVO selectMember(String member_no) {
		return memberDao.selectMember(member_no);
	}

	// 사원 정보 등록
	@Override
	public int registerMember(MemberVO memberInfo) {
		return memberDao.registerMember(memberInfo);
	}

	// 사원 정보 수정
	@Override
	public int updateMember(MemberVO memberInfo) {
		return memberDao.updateMember(memberInfo);
	}

	// 사원 정보 삭제
	@Override
	public int deleteMember(List<String> member_no_list) {
		return memberDao.deleteMember(member_no_list);
	}
	
	// 코드 정보 가져오기
	@Override
	public List<Object> getCodeInfo(String code_id) {
		return memberDao.getCodeInfo(code_id);
	}

	@Override
	public List<String> getBirthDate(HashMap<String, String> date) {
		return memberDao.getBirthDate(date);
	}

	@Override
	public List<String> getMarriageDate(String date) {
		return memberDao.getMarriageDate(date);
	}

	@Override
	public int checkemail(String email) {
		return memberDao.checkemail(email);
	}
	

}
