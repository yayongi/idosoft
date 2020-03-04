package kr.co.idosoft.demo.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import kr.co.idosoft.demo.vo.DemoVO;

@Component
public class DemoDaoImpl implements DemoDao {
	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	@Override
	public void test(String id) {
		Integer test = sqlTemplate.selectOne("demo.teste");
		System.out.println("★:"+test);
	}
	
	@Override
	public Integer selectTestCnt(DemoVO vo) {
		return sqlTemplate.selectOne("demo.testCnt", vo);
	}
	
	@Override
	public List<DemoVO> selectTestList(DemoVO vo) {
		return sqlTemplate.selectList("demo.testList", vo);
	}

	
}
