package kr.co.idosoft.intranet.notice.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.notice.vo.NoticeVO;

@Repository("NoticeDao")
public class NoticeDaoImpl implements NoticeDao{
	
	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	//공지사항 등록
	@Override
	public void insert(NoticeVO noticeVO) {
		sqlTemplate.insert("notice.insert", noticeVO);
	}
	
	//공지사항 수정
	@Override
	public int update(NoticeVO noticeVO) {
		return sqlTemplate.update("notice.update", noticeVO);
	}
	
	//공지사항 삭제
	@Override
	public int delete(int board_no) {
		return sqlTemplate.delete("notice.deleteInfo", board_no);
	}
	
	//공지사항 가져오기
	@Override
	public NoticeVO select(int board_no) {
		// TODO Auto-generated method stub
		return sqlTemplate.selectOne("notice.selectInfo", board_no);
	}
	
//	공지사항 리스트 가져오기
	@Override
	public List<NoticeVO> selectList() {
		List<NoticeVO> list = sqlTemplate.selectList("notice.selectList");
		return list;
	}
	
	//대쉬보드용 리스트
	@Override
	public List<NoticeVO> selectListDashboard() {
		return sqlTemplate.selectList("selectListDashboard");
	}
	
	
	
	
	
	
	
	
	
	
}
