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
	public List<Map<String, Object>> getlist() {
		return dao.getlist();
	}


	@Override
	public int getlistCount() {
		return dao.getlistCount();
	}

}
