package kr.co.idosoft.intranet.project.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.project.model.dao.HistoryDaoImpl;

@Service
public class HistoryServiceImpl implements HistoryService {

	@Resource HistoryDaoImpl dao;

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
	public void deleteInfo(int mem_hist_no) {
		// TODO Auto-generated method stub
		dao.deleteInfo(mem_hist_no);
	}

	@Override
	public HashMap<String, Object> selectInfo(int mem_hist_no) {
		// TODO Auto-generated method stub
		return dao.selectInfo(mem_hist_no);
	}

	@Override
	public List<Map<String, Object>> selectList() {
		// TODO Auto-generated method stub
		return dao.selectList();
	}

	@Override
	public void removeHistoryForPro(String project_no) {
		// TODO Auto-generated method stub
		dao.removeHistoryForPro(project_no);
	}
	

}
