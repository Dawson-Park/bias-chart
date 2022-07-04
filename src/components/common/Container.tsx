import styled from "styled-components";

export interface IContainer {
	width: string;
	height: string;
	padding?: string;
}

const Container = styled("div")<IContainer>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  width: ${props => props.width};
  height: ${props => props.height};
  padding: ${props => props.padding};
  min-width: 240px;
  min-height: 240px;
  max-height: 750px;

  svg {
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  g.tick text {
    font-size: 12px;
  }
  
  g.pie-container {
    
  }
  
  rect {
    transition: opacity ease .3s;
  }
  
  .tooltip {
    transition: all ease .2s;
  }
`;

export default Container;