package kr.co.idosoft.intranet.admin.model.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.admin.model.dao.CodeDaoImpl;

@Service
public class CodeServiceImpl implements CodeService {

	@Resource CodeDaoImpl dao;
	
	@Override
	public void insert(Map<String, Object> insert) {
		// TODO Auto-generated method stub
		dao.insert(insert);
	}


	@Override
	public void update(Map<String, Object> update) {
		// TODO Auto-generated method stub
		dao.update(update);
	}


	@Override
	public void deleteInfo(String code_id) {
		// TODO Auto-generated method stub
		dao.deleteInfo(code_id);
	}
	
	@Override
	public List<Map<String, Object>> getlist() {
		return dao.getlist();
	}


	@Override
	public int getlistCount() {
		return dao.getlistCount();
	}


	@Override
	public List<Map<String, Object>> getLowCodeList(String code_id) {
		// TODO Auto-generated method stub
		return dao.getLowCodeList(code_id);
	}
}
