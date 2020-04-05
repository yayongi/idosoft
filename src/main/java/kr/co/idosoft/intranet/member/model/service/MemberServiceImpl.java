package kr.co.idosoft.intranet.member.model.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
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
	
	// �궗�썝 �젙蹂� 由ъ뒪�듃 
	@Override
	public List<MemberVO> selectMemberList() {
		return memberDao.selectMemberList() ;
	}

	// �궗�썝 �젙蹂� �샇異�
	@Override
	public MemberVO selectMember(String member_no) {
		return memberDao.selectMember(member_no);
	}

	// �궗�썝 �젙蹂� �벑濡�
	@Override
	public int registerMember(MemberVO memberInfo) {
		return memberDao.registerMember(memberInfo);
	}

	// �궗�썝 �젙蹂� �닔�젙
	@Override
	public int updateMember(MemberVO memberInfo) {
		return memberDao.updateMember(memberInfo);
	}

	// �궗�썝 �젙蹂� �궘�젣
	@Override
	public int deleteMember(List<String> member_no_list) {
		return memberDao.deleteMember(member_no_list);
	}
	
	// 肄붾뱶 �젙蹂� 媛��졇�삤湲�
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
	public int checkemail(MemberVO memberInfo) {
		return memberDao.checkemail(memberInfo);
	}

	@Override
	public String findMemberNo(String member_no) {
		return memberDao.findMemberNo(member_no);
	}

	@Override
	public List<LinkedHashMap<String, Object>> exportExcelList(List<LinkedHashMap<String, Object>> memberVoList) {
		return memberDao.exportExcelList(memberVoList);
	}

	@Override
	public int initializePassword(MemberVO memberVo) {
		return memberDao.initializePassword(memberVo);
	}
	

}
