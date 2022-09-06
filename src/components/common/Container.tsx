import styled from "styled-components";

export interface IContainer {
	width: string;
	height: string;
	padding?: string;
	type?:"Bar"|"Line"|"Spider"|"Pie"|"Scatter3d";
}

const Container = styled("div")<IContainer>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  width: ${props => props.width};
  height: ${props => props.height};
  padding: ${props => props.padding};
  overflow: hidden;
  min-width: ${props => { 
	  if(props.type !== "Scatter3d") return '240px';
	  else return '300px';
  }};
  min-height: ${props => {
    if(props.type !== "Scatter3d") return '240px';
    else return '300px';
  }};
  max-width: ${props => {
    if(props.type !== "Scatter3d") return 'none';
    else return '900px';
  }};
  max-height: ${props => {
    if(props.type !== "Scatter3d") return '750px';
    else return '900px';
  }};

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
    transform: translateX(50%);
  }

  rect.bar-rect, g.line-group path, g.line-dots circle, g.spider-values {
    transition: opacity ease .3s;
  }
  
  g.tooltip {
    transition: all ease .2s;
  }
`;

export default Container;