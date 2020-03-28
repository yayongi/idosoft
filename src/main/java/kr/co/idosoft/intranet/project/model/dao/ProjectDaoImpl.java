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
	public void deleteInfo(int project_no) {
		// TODO Auto-generated method stub
		sqlTemplate.delete("project.deleteInfo", project_no);
	}

	@Override
	public HashMap<String, Object> selectInfo(int project_no) {
		// TODO Auto-generated method stub
		return sqlTemplate.selectOne("project.selectInfo", project_no);
	}

	@Override
	public List<Map<String, Object>> selectList() {
		// TODO Auto-generated method stub
		return (ArrayList)sqlTemplate.selectList("project.selectList");
	}

	
	
}
