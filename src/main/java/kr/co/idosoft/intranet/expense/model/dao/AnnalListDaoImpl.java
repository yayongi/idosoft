package kr.co.idosoft.intranet.expense.model.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


/**
 * 
 * @author 유기환
 * @since 2020.03.09
 * @content AnnualList DAO interface
 */
@Repository
public class AnnalListDaoImpl implements AnnalListDao {
	@Autowired
	private SqlSessionTemplate sqlTemplate;

	private static final Logger LOG = LoggerFactory.getLogger(AnnalListDaoImpl.class);

	/**
	 * 경비관리목록 총개수
	 * @param data
	 * @return int
	 */

	@Override
	public int getListCount(Map<String, Object> data) {
		
		Integer result = (Integer)sqlTemplate.selectOne("expense.getAnnalListCount", data);
		
		return result != null ? result : 0;
	}

	/**
	 * 경비관리목록 조회
	 * 
	 * @return String
	 */

	@Override
	public List<Map<String, Object>> getlist(Map<String, Object> data) {
		/* Pageing 처리 START */ 
		int offset =
		((int)data.get("currentPage") - 1) * (int)data.get("limit"); 
		RowBounds rowBounds = new RowBounds(offset, (int)data.get("limit"));

		return (ArrayList)sqlTemplate.selectList("expense.getAnnalList", data, rowBounds); 
		/* Pageing 처리 END */ 
	}
	/**
	 * 코드 목록
	 * 
	 * @return String
	 */
	@Override
	public List<Map<String, Object>> getCode(Map<String, Object> data) {
		return sqlTemplate.selectList("expense.getCode", data);
	}
	/**
	 * 경비 번호로 데이터 출력
	 * 
	 * @return String
	 */
	@Override
	public Map<String, Object> getView(Map<String, Object> data) {
		return sqlTemplate.selectOne("expense.getAnnView", data);
	}
	/**
	 * 직급인 대표인 사원 번호 추출
	 * 
	 * @return String
	 */
	@Override
	public String getRepresentativeNo() {
		return (String) sqlTemplate.selectOne("expense.getRepresentativeNo");
	}
	/**
	 * 소속 프로젝트 PM 번호 추출
	 * @param data 
	 * 
	 * @return String
	 */
	@Override
	public String getProjectPMNo(Map<String, Object> data) {
		return (String) sqlTemplate.selectOne("expense.getProjectPMNo");
	}
	/**
	 * 1차결재자 번호 추출
	 * 
	 * @return String
	 */
	@Override
	public String getFirSancternerMno() {
		return (String) sqlTemplate.selectOne("expense.getFirSancternerMno");
	}
	/**
	 * 경비 등록 처리
	 * 
	 * @return boolean
	 */
	@Override
	public boolean insertExpense(Map<String, Object> data) {

		Integer result = sqlTemplate.update("expense.insertExpense", data);

		if (result > 0) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * 경비 수정 처리
	 * 
	 * @return boolean
	 */
	@Override
	public boolean updateExpense(Map<String, Object> data) {
		Integer result = sqlTemplate.update("expense.updateExpense", data);

		if (result > 0) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * 경비 삭제 처리
	 * 
	 * @return boolean
	 */
	@Override
	public boolean deleteExpense(Map<String, Object> data) {
		Integer result = sqlTemplate.delete("expense.deleteExpense", data);

		if (result > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 총금액 합계
	 * 
	 * @return String
	 */
	@Override
	public String getTotalAmount(Map<String, Object> data) {
		
		Integer result = (Integer)sqlTemplate.selectOne("expense.getTotalAmount", data);
		
		return String.valueOf(result != null ? result : 0);
	}
	/**
	 * 경비 진행
	 * 
	 * @return boolean
	 */
	@Override
	public boolean Proceed(Map<String, Object> data) {
		Integer result = sqlTemplate.update("expense.Proceed", data);

		if (result > 0) {
			return true;
		} else {
			return false;
		}
	}
	@Override
	public String getTotalProgAmount(Map<String, Object> data) {
		Integer result = (Integer)sqlTemplate.selectOne("expense.getTotalProgAmount", data);
		
		return String.valueOf(result != null ? result : 0);
	}
	
	@Override
	public String getTotalFirAppAmount(Map<String, Object> data) {
		Integer result = (Integer)sqlTemplate.selectOne("expense.getTotalFirAppAmount", data);
		
		return String.valueOf(result != null ? result : 0);
	}
	
	@Override
	public String getTotalCompAmount(Map<String, Object> data) {
		Integer result = (Integer)sqlTemplate.selectOne("expense.getTotalCompAmount", data);
		
		return String.valueOf(result != null ? result : 0);
	}
	
	@Override
	public String getTotalReturnAmount(Map<String, Object> data) {
		Integer result = (Integer)sqlTemplate.selectOne("expense.getTotalReturnAmount", data);
		
		return String.valueOf(result != null ? result : 0);
	}
	
}
