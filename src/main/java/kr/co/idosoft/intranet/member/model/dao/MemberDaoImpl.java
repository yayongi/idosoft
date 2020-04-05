package kr.co.idosoft.intranet.member.model.dao;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.member.vo.MemberVO;

@Repository
public class MemberDaoImpl implements MemberDao {

	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	private static final Logger logger = LoggerFactory.getLogger(MemberDaoImpl.class);
	
	// �궗�썝 �젙蹂� 由ъ뒪�듃 媛��졇�삤湲�
	@Override
	public List<MemberVO> selectMemberList() {
		return sqlTemplate.selectList("selectMemberList");
	}

	// �궗�썝 �젙蹂� 媛��졇�삤湲�
	@Override
	public MemberVO selectMember(String member_no) {
		return sqlTemplate.selectOne("getMemberInfo", member_no);
	}

	// �궗�썝 �젙蹂� �벑濡앺븯湲�
	@Override
	public int registerMember(MemberVO memberInfo) {
		return sqlTemplate.insert("registerMemberInfo", memberInfo);
	}
	
	// �궗�썝 �젙蹂� �닔�젙�븯湲�
	@Override
	public int updateMember(MemberVO memberInfo) {
		return sqlTemplate.update("updateMemberInfo", memberInfo);
	}
	
	// �궗�썝 �젙蹂� �궘�젣�븯湲�
	@Override
	public int deleteMember(List<String> member_no_list) {
		return sqlTemplate.delete("deleteMemberInfo", member_no_list);
	}

	@Override
	public List<Object> getCodeInfo(String code_id) {
		return sqlTemplate.selectList("getCodeInfo",code_id);
	}

	@Override
	public List<String> getBirthDate(HashMap<String, String> date) {
		return sqlTemplate.selectList("getBirthDate", date);
	}

	@Override
	public List<String> getMarriageDate(String date) {
		return sqlTemplate.selectList("getMarriageDate", date);
	}

	@Override
	public int checkemail(MemberVO memberInfo) {
		return sqlTemplate.selectOne("checkemail", memberInfo);
	}

	@Override
	public String findMemberNo(String member_no) {
		return sqlTemplate.selectOne("findMemberNo", member_no);
	}

	@Override
	public List<LinkedHashMap<String, Object>> exportExcelList(List<LinkedHashMap<String, Object>> memberVoList) {
		return sqlTemplate.selectList("exportExcelList",memberVoList);
	}

	@Override
	public int initializePassword(MemberVO memberVo) {
		// TODO Auto-generated method stub
		return sqlTemplate.update("initializePassword",memberVo);
	}
}
