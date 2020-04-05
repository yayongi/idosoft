package kr.co.idosoft.intranet.member.model.dao;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import kr.co.idosoft.intranet.member.vo.MemberVO;

public interface MemberDao {
	// �궗�썝 由ъ뒪�듃 �샇異�
	public List<MemberVO> selectMemberList();
	// �궗�썝 �젙蹂� �샇異�
	public MemberVO selectMember(String member_no);
	// �궗�썝 �젙蹂� �벑濡�
	public int registerMember(MemberVO memberInfo);
	// �궗�썝 �젙蹂� �닔�젙
	public int updateMember(MemberVO memberInfo);
	// �궗�썝 �젙蹂� �궘�젣
	public int deleteMember(List<String> member_no_list);
	// 肄붾뱶 �젙蹂� 媛��졇�삤湲�
	public List<Object> getCodeInfo(String code_id);
	// �깮�씪 媛��졇�삤湲�
	public List<String> getBirthDate(HashMap<String, String> date);
	// 寃고샎湲곕뀗�씪 媛��졇�삤湲�
	public List<String> getMarriageDate(String date);
	// �씠硫붿씪 以묐났寃��궗
	public int checkemail(MemberVO memberInfo);
	// �궗踰덉뿰�룄 寃��깋
	public String findMemberNo(String member_no);
	// �궗�썝�젙蹂� �뿊�� 異쒕젰
	public List<LinkedHashMap<String, Object>> exportExcelList(List<LinkedHashMap<String, Object>> memberVoList);
	// �궗�썝 鍮꾨�踰덊샇 珥덇린�솕
	public int initializePassword(MemberVO memberVo);
}
