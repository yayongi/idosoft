# idosoft
IDOSOFT 인트라넷

* Spring + gradle + React(Node.js 기반) + MariaDB 연동 
* eclipse + tomcat9 
* Material UI 적용

1. Local에 Node.js 설치
2. git에서 해당 프로젝트 Download
3. idosoft 프로젝트 경로에서 npm insall 명령어 수행
4. npm start 실행 -> 8000 포트 
5. 톰캣 실행 (context path: intranet)

* 번들 최적화를 위한 분석방법

1. npm run stat 을 실행하면 stats.json 이 생성됨 (package.json scipts.stat에 정의)
2. json 파일을 아래 사이트에 업로드하여 살펴보면 됨.

    https://webpack.github.io/analyse/

    https://chrisbateman.github.io/webpack-visualizer/


3.아래 패키지를 설치해서 로컬 환경에서 분석하는 방법도 있음.
https://github.com/webpack-contrib/webpack-bundle-analyzer
