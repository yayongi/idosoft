package kr.co.idosoft.demo.dao;

import java.util.List;

import kr.co.idosoft.demo.vo.DemoVO;;

public interface DemoDao {

	public void test(String id);
	public Integer selectTestCnt(DemoVO dto);
	public List<DemoVO> selectTestList(DemoVO dto);
	
}
