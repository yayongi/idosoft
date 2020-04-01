package kr.co.idosoft.intranet.project.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.admin.model.dao.CodeDaoImpl;
import kr.co.idosoft.intranet.member.model.dao.MemberDaoImpl;
import kr.co.idosoft.intranet.member.vo.MemberVO;
import kr.co.idosoft.intranet.project.model.dao.HistoryDaoImpl;
import kr.co.idosoft.intranet.project.model.dao.ProjectDaoImpl;

@Service
public class HistoryServiceImpl implements HistoryService {

	@Resource HistoryDaoImpl hist_dao;
	@Resource MemberDaoImpl mem_dao;
	@Resource ProjectDaoImpl pro_dao;
	@Resource CodeDaoImpl code_dao;
	
	
	
	@Override
	public void insert(HashMap<String, Object> insert) {
		// TODO Auto-generated method stub
		hist_dao.insert(insert);
	}

	@Override
	public void update(HashMap<String, Object> update) {
		// TODO Auto-generated method stub
		hist_dao.update(update);
	}

	@Override
	public List<Map<String, Object>> selectHistory(String member_no) {
		// TODO Auto-generated method stub
		return hist_dao.selectHistory(member_no);
	}

	@Override
	public List<MemberVO> selectMemberList() {
		return mem_dao.selectMemberList() ;
	}

	@Override
	public List<Map<String, Object>> selectAllList() {
		return pro_dao.selectAllList();
	}

	@Override
	public List<Map<String, Object>> getLowCodeList(String code_id) {
		// TODO Auto-generated method stub
		return code_dao.getLowCodeList(code_id);
	}

}
