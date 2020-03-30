package kr.co.idosoft.intranet.project.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.project.model.dao.ProjectDaoImpl;

@Service
public class ProjectServiceImpl implements ProjectService {

	@Resource ProjectDaoImpl dao;

	@Override
	public void insert(HashMap<String, Object> insert) {
		// TODO Auto-generated method stub
		dao.insert(insert);
	}

	@Override
	public void update(HashMap<String, Object> update) {
		// TODO Auto-generated method stub
		dao.update(update);
	}

	@Override
	public void deleteInfo(int project_no) {
		// TODO Auto-generated method stub
		dao.deleteInfo(project_no);
	}

	@Override
	public HashMap<String, Object> selectInfo(int project_no) {
		// TODO Auto-generated method stub
		return dao.selectInfo(project_no);
	}

	@Override
	public List<Map<String, Object>> selectList(HashMap<String, Object> condition) {
		// TODO Auto-generated method stub
		return dao.selectList(condition);
	}

	@Override
	public String selectMaxProject() {
		// TODO Auto-generated method stub
		return dao.selectMaxProject();
	}
	
	
	@Override
	public List<Map<String, Object>> selectAllList() {
		// TODO Auto-generated method stub
		return dao.selectAllList();
	}

	@Override
	public void insertProjectMember(HashMap<String, Object> insert) {
		// TODO Auto-generated method stub
		dao.insert_member(insert);
	}

	@Override
	public List<HashMap<String, String>> getPresentProject() {
		return dao.getPresentProject();
	}

	@Override
	public List<HashMap<String, String>> getProjectMember() {
		return dao.getProjectMember();
	}


}
