package kr.co.idosoft.demo.service;

import java.util.List;

import javax.annotation.Resource;
import org.springframework.stereotype.Service;

import kr.co.idosoft.demo.dao.DemoDao;
import kr.co.idosoft.demo.vo.DemoVO;;

@Service
public class DemoServiceImpl implements DemoService {

	@Resource DemoDao dao;
	
	@Override
	public Integer selectTestCnt(DemoVO vo) {
		return dao.selectTestCnt(vo);
	}
	
	@Override
	public List<DemoVO> selectTestList(DemoVO vo) {
		return dao.selectTestList(vo);
	}

	
}
