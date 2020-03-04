package kr.co.idosoft.demo.service;

import java.util.List;

import kr.co.idosoft.demo.vo.DemoVO;

public interface DemoService {

	public Integer selectTestCnt(DemoVO vo);
	public List<DemoVO> selectTestList(DemoVO vo);
}
