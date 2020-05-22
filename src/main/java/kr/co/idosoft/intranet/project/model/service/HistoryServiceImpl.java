package kr.co.idosoft.intranet.project.model.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
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
		hist_dao.insert(insert);
	}

	@Override
	public void update(HashMap<String, Object> update) {
		hist_dao.update(update);
	}

	@Override
	public List<Map<String, Object>> selectHistory(String member_no) {
		return hist_dao.selectHistory(member_no);
	}

	@Override
	public List<MemberVO> selectMemberList() {
		return mem_dao.selectMemberList() ;
	}

	@Override
	public List<Map<String, Object>> selectAllList(HashMap<String, Object> condition) {
		return pro_dao.selectAllList(condition);
	}

	@Override
	public List<Map<String, Object>> getLowCodeList(String code_id) {
		return code_dao.getLowCodeList(code_id);
	}

	@Override
	public LinkedHashMap<String, Object> getinfo(LinkedHashMap<String, Object> data) {
		return hist_dao.getinfo(data);
	}

	@Override
	public void removeHistory(String mem_hist_no) {
		hist_dao.removeHistory(mem_hist_no);
	}

	@Override
	public List<Map<String, Object>> getProjectList(Map<String, Object> data) {
		return hist_dao.getProjectList(data);
	}

}
