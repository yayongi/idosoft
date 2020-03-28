package kr.co.idosoft.intranet.admin.model.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class CodeDaoImpl implements CodeDao {
	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	private static final Logger LOG = LoggerFactory.getLogger(CodeDaoImpl.class);

	@Override
	public List<Map<String, Object>> getlist() {
		// TODO Auto-generated method stub
		
		return (ArrayList)sqlTemplate.selectList("admin.getList");
	}

	@Override
	public int getlistCount() {
		// TODO Auto-generated method stub
		return (int)sqlTemplate.selectOne("admin.getListCount");
	}

	@Override
	public void insert(Map<String, Object> insert) {
		// TODO Auto-generated method stub
		sqlTemplate.insert("admin.insert", insert);
	}

	@Override
	public void update(Map<String, Object> update) {
		// TODO Auto-generated method stub
		sqlTemplate.update("admin.update", update);
	}

	@Override
	public void deleteInfo(String code_id) {
		// TODO Auto-generated method stub
		sqlTemplate.delete("admin.deleteInfo", code_id);
	}

	@Override
	public List<Map<String, Object>> getLowCodeList(String code_id) {
		// TODO Auto-generated method stub
		return (ArrayList)sqlTemplate.selectList("admin.getLowCodeList", code_id);
	}
}
