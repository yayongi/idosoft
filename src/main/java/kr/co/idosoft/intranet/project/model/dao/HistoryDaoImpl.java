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
public class HistoryDaoImpl implements HistoryDao {
	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	private static final Logger LOG = LoggerFactory.getLogger(HistoryDaoImpl.class);

	@Override
	public void insert(HashMap<String, Object> insert) {
		// TODO Auto-generated method stub
		sqlTemplate.insert("history.insert", insert);
	}

	@Override
	public void update(HashMap<String, Object> update) {
		// TODO Auto-generated method stub
		sqlTemplate.update("history.update", update);
	}

	@Override
	public List<Map<String, Object>> selectHistory(String member_no) {
		// TODO Auto-generated method stub
		return (ArrayList)sqlTemplate.selectList("history.selectHistory", member_no);
	}

	@Override
	public Map<String, Object> selectDetailHistory(String mem_hist_no) {
		// TODO Auto-generated method stub
		return sqlTemplate.selectOne("history.selectDetailHistory", mem_hist_no);
	}

	@Override
	public void removeHistory(String mem_hist_no) {
		sqlTemplate.update("history.removeHistory", mem_hist_no);
		
	}

}
