package kr.co.idosoft.intranet.common.model.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.common.model.dao.ExcelDaoImpl;

/**
 * 
 * @author 유기환
 * @since 2020.03.16
 * @content ExcelService
 */

@Service
public class ExcelServiceImpl implements ExcelService {
	@Autowired
	ExcelDaoImpl excelDao;

	private static final Logger LOG = LoggerFactory.getLogger(ExcelServiceImpl.class);

	@Override
	public List<LinkedHashMap<String, Object>> getCodetoList(Map<String, Object> data) {
		return excelDao.getCodetoList(data);
	}

	@Override
	public List<String> getCodetoListString(Map<String, Object> data) {
		List<String> dataList = excelDao.getCodetoListString(data);
		return dataList;
	}
}
