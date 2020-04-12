package kr.co.idosoft.intranet.project.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.admin.model.dao.CodeDaoImpl;
import kr.co.idosoft.intranet.member.model.dao.MemberDaoImpl;
import kr.co.idosoft.intranet.member.vo.MemberVO;
import kr.co.idosoft.intranet.project.model.dao.ProjectDaoImpl;

@Service
public class ProjectServiceImpl implements ProjectService {

	@Resource ProjectDaoImpl pro_dao;
	@Resource CodeDaoImpl code_dao;
	@Resource MemberDaoImpl memberDao;

	@Override
	public void insert(HashMap<String, Object> insert) {
		// TODO Auto-generated method stub
		pro_dao.insert(insert);
	}

	@Override
	public void update(HashMap<String, Object> update) {
		// TODO Auto-generated method stub
		pro_dao.update(update);
	}

	@Override
	public void deleteInfo(String project_no) {
		// TODO Auto-generated method stub
		pro_dao.deleteInfo(project_no);
	}

	@Override
	public HashMap<String, Object> selectInfo(String project_no) {
		// TODO Auto-generated method stub
		return pro_dao.selectInfo(project_no);
	}


	@Override
	public String selectMaxProject() {
		// TODO Auto-generated method stub
		return pro_dao.selectMaxProject();
	}
	
	
	@Override
	public List<Map<String, Object>> selectAllList(HashMap<String, Object> condition) {
		// TODO Auto-generated method stub
		return pro_dao.selectAllList(condition);
	}

	@Override
	public void insertProjectMember(HashMap<String, Object> insert) {
		// TODO Auto-generated method stub
		pro_dao.insert_member(insert);
	}

	@Override
	public List<Map<String, Object>> projectMemberList(String project_no) {
		// TODO Auto-generated method stub
		return pro_dao.projectMemberList(project_no);
	}

	@Override
	public void removeMember(HashMap<String, Object> info) {
		// TODO Auto-generated method stub
		pro_dao.removeMember(info);
	}

	@Override
	public void updateMember(HashMap<String, Object> member) {
		// TODO Auto-generated method stub
		pro_dao.updateMember(member);
	}
	
	@Override
	public List<HashMap<String, String>> getPresentProject() {
		return pro_dao.getPresentProject();
	}

	@Override
	public List<HashMap<String, String>> getProjectMember() {
		return pro_dao.getProjectMember();
	}

	@Override
	public void removeMemberForPro(String project_no) {
		// TODO Auto-generated method stub
		pro_dao.removeMemberForPro(project_no);
	}

	@Override
	public List<Map<String, Object>> getLowCodeList(String code_id) {
		// TODO Auto-generated method stub
		return code_dao.getLowCodeList(code_id);
	}

	@Override
	public List<MemberVO> selectMemberList() {
		// TODO Auto-generated method stub
		return memberDao.selectMemberList() ;
	}

	@Override
	public List<Map<String, Object>> selectList(HashMap<String, Object> condition) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<HashMap<String, Object>> getGraphInfo(HashMap<String, Object> condition) {
		// TODO Auto-generated method stub
		return pro_dao.getGraphInfo(condition);
	}

	@Override
	public List<Map<String, Object>> selectForList(HashMap<String, Object> condition) {
		// TODO Auto-generated method stub
		return pro_dao.selectForList(condition);
	}

	@Override
	public List<HashMap<String, Object>> getGraphForInfo(HashMap<String, Object> condition) {
		// TODO Auto-generated method stub
		return pro_dao.getGraphForInfo(condition);
	}

	@Override
	public void traffic_insert(HashMap<String, Object> insert) {
		// TODO Auto-generated method stub
		pro_dao.traffic_insert(insert);
	}

	@Override
	public void traffic_update(HashMap<String, Object> update) {
		// TODO Auto-generated method stub
		pro_dao.traffic_update(update);
	}

	@Override
	public void traffic_delete(HashMap<String, Object> delete) {
		// TODO Auto-generated method stub
		pro_dao.traffic_delete(delete);
	}
	
	@Override
	public void traffic_delete_all(HashMap<String, Object> delete) {
		// TODO Auto-generated method stub
		pro_dao.traffic_delete_all(delete);
	}

	@Override
	public List<HashMap<String, Object>> getSelectTraffic(HashMap<String, Object> condition) {
		// TODO Auto-generated method stub
		return pro_dao.getSelectTraffic(condition);
	}
	

}
