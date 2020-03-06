** 설치한 라이브러리 설명

react : 리액트를 사용하기 위하 필수 라이브러리 입니다.
react-dom: 리액트 라이브러리 입니다. 브라우저를 위한 DOM 메소드를 제공합니다.
react-router-dom: 브라우저를 위한 라우팅 기능을 제공합니다.
@babel/core: 바벨을 사용하기 위한 필수 라이브러리입니다.

바벨은 ES6/ES7 코드를 ES5 코드로 트랜스파일링 하기 위한 도구입니다.
@babel-polyfill: ES2015의 새로운 객체와 메소드를 사용할 수 있도록 도와줍니다.
@babel/preset-env: 최신 자바스크립트 기능을 ES5로 트랜스파일 해주는 라이브러리입니다.

바벨 7버전부터 사용 가능한 라이브러리입니다. 바벨 7버전 아래의 경우 stage-0, stage-1, stage-2, stage-3을 설치하여 트랜스파일 해줘야합니다.
@babel/preset-react: 리액트 환경(JSX)을 위한 라이브러리입니다.
@babel/plugin-proposal-class-properties: 클래스 프로퍼티를 사용할 수 있도록 도와주는 바벨 플러그인입니다.
babel-loader: 바벨과 웹팩을 이용해 자바스크립트 파일을 트랜스파일링 합니다.
html-webpack-plugin: 웹팩 번들에 html파일을 제공하는 웹팩 라이브러리입니다.
clean-webpack-plugin: 빌드하기전 목적지에 대한 폴더를 삭제해주는 웹팩 라이브러리입니다.
css-loader: css 파일을 import 또는 require할 수 있도록 도와주는 웹팩 라이브러리입니다.
scss-loader: scss 파일을 import 또는 require할 수 있도록 도와주고 CSS 로 변환할 수 있도록 도와주는 웹팩 라이브러리입니다.
style-loader: 읽은 css파일을 style태그로 만들어 head태그에 삽입해주는 웹팩 라이브러리입니다.
webpack: 웹팩을 사용하기 위한 필수 라이브러리입니다.
webpack-cli: 웹팩 커맨드라인 인터페이스 라이브러리입니다.
webpack-dev-server: 웹팩 개발서버 라이브러리입니다. (소스변경 시, 실시간으로 브라우저에 반영됨.)

open-color : UI 디자인을 위한 일반적인 색상을 지줭하는 웹팩 라이브러리이다. ( https://yeun.github.io/open-color/documents.html )

@material-ui/core : google에서 제공하는 react 용 UI 라이브러리이다.
@material-ui/icons : google에서 제공하는 react 용 UI 라이브러리이다.
recharts : 차트 라이브러리이다. ( https://www.npmjs.com/package/recharts ) 