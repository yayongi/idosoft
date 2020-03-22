export {default as Code} from './Admin/Code';		// 관리자 -> 코드관리
export {default as ModifyCode} from './Admin/ModifyCode';	// 관리자 -> 코드관리 -> 코드추가
export {default as Dashboard} from './Dashboard';	// 메인
export {PayList as PayList} from './Expense';			// 경비관리 -> 교통/통신비관리
export {AnnualList as AnnualList} from './Expense';	// 경비관리 -> 경비관리목록
export {AnnualView as AnnualView} from './Expense';	// 경비관리 -> 경비관리목록 상세
export {ApprovalList as ApprovalList} from './Expense';		// 경비관리 -> 경비결재관리
export {ApprovalView as ApprovalView} from './Expense';		// 경비관리 -> 경비결재관리 상세
export {MonthlystatMemberSelectView as MonthlystatMemberSelectView} from './Expense';		// 경비관리 -> 경비결재관리 -> 경비결재상세

export {SignIn as SignIn} from './Login';				// 로그인

export {ResPassword as ResPassword} from './Login';				// 로그인
export {default as MemberList} from './Member';		// 사원관리
export {default as MemberReg} from './Member/MemberReg';		// 사원관리
export {default as MemberMod_admin} from './Member/MemberMod/admin';		// 사원관리
export {default as MemberMod_user} from './Member/MemberMod/user';		// 사원관리

export {NoticeList as NoticeList} from './Notice';				// 공지사항 -> 목록
export {NoticeRegist as NoticeRegist} from './Notice';			// 공지사항 -> 공지사항등록관리
export {History as History} from './Project';					// 프로젝트 -> 프로젝트이력
export {ModifyHistory as ModifyHistory} from './Project/Modify';		// 프로젝트 -> 프로젝트이력  -> 프로젝트추가
export {Manage as Manage} from './Project';						// 프로젝트 -> 프로젝트관리
export {ModifyProject as ModifyProject} from './Project/Modify';// 프로젝트 -> 프로젝트관리
export {ResourceList as ResourceList} from './Resource';		// 자원관리 -> 자원리스트
export {ResourceRegist as ResourceRegist} from './Resource';	// 자원관리 -> 자원등록관리
export {default as NotFound} from './NotFound';	// 페이지 없는 경우
