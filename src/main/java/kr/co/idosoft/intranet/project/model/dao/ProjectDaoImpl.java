package kr.co.idosoft.intranet.project.model.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectDaoImpl implements ProjectDao {
	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	private static final Logger LOG = LoggerFactory.getLogger(ProjectDaoImpl.class);

	@Override
	public void insert(HashMap<String, Object> insert) {
		// TODO Auto-generated method stub
		sqlTemplate.insert("project.insert", insert);
	}

	@Override
	public void update(HashMap<String, Object> update) {
		// TODO Auto-generated method stub
		sqlTemplate.update("project.update", update);
	}

	@Override
	public void deleteInfo(String project_no) {
		// TODO Auto-generated method stub
		sqlTemplate.delete("project.deleteInfo", project_no);
	}

	@Override
	public HashMap<String, Object> selectInfo(String project_no) {
		// TODO Auto-generated method stub
		return sqlTemplate.selectOne("project.selectInfo", project_no);
	}


	@Override
	public List<Map<String, Object>> selectAllList(HashMap<String, Object> condition) {
		// TODO Auto-generated method stub
		return (ArrayList)sqlTemplate.selectList("project.selectAllList", condition);
	}
	
	@Override
	public String selectMaxProject() {
		// TODO Auto-generated method stub
		return sqlTemplate.selectOne("project.selectMaxProject");
	}

	@Override
	public void insert_member(HashMap<String, Object> insert) {
		sqlTemplate.insert("project.insert_member", insert);
		
	}

	@Override
	public List<Map<String, Object>> projectMemberList(String project_no) {
		// TODO Auto-generated method stub
		return (ArrayList)sqlTemplate.selectList("project.projectMemberList", project_no);
	}
	
	@Override
	public void removeMember(HashMap<String, Object> info) {
		// TODO Auto-generated method stub
		sqlTemplate.delete("project.removeMember", info);
	}

	@Override
	public void updateMember(HashMap<String, Object> member) {
		// TODO Auto-generated method stub
		sqlTemplate.update("project.updateMember", member);
	}
	
	@Override
	public List<HashMap<String, String>> getPresentProject() {
		return sqlTemplate.selectList("getPresentProject");
	}
	
	@Override
	public List<HashMap<String, String>> getProjectMember() {
		return sqlTemplate.selectList("getProjectMember");
	}

	@Override
	public void removeMemberForPro(String project_no) {
		// TODO Auto-generated method stub
		sqlTemplate.delete("project.removeMemberForPro", project_no);
	}

	@Override
	public List<HashMap<String, Object>> getGraphInfo(HashMap<String, Object> condition) {
		// TODO Auto-generated method stub
		return sqlTemplate.selectList("project.getGraphInfo", condition);
	}

	@Override
	public List<Map<String, Object>> selectForList(HashMap<String, Object> condition) {
		// TODO Auto-generated method stub
		return (ArrayList)sqlTemplate.selectList("project.selectForList", condition);
	}

	@Override
	public List<HashMap<String, Object>> getGraphForInfo(HashMap<String, Object> condition) {
		// TODO Auto-generated method stub
		return sqlTemplate.selectList("project.getGraphForInfo", condition);
	}

	@Override
	public void traffic_insert(HashMap<String, Object> insert) {
		// TODO Auto-generated method stub
		sqlTemplate.insert("project.traffic_insert", insert);
	}

	@Override
	public void traffic_update(HashMap<String, Object> update) {
		// TODO Auto-generated method stub
		sqlTemplate.update("project.traffic_update", update);
	}

	@Override
	public void traffic_delete(HashMap<String, Object> delete) {
		// TODO Auto-generated method stub
		sqlTemplate.delete("project.traffic_delete", delete);
	}

	@Override
	public List<HashMap<String, Object>> getSelectTraffic(HashMap<String, Object> condition) {
		// TODO Auto-generated method stub
		return sqlTemplate.selectList("project.traffic_select", condition);
	}
}
