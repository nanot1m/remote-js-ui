import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useContext
} from "react";
import styled, { ThemeContext } from "styled-components";
import { themeGet } from "styled-system";
import { BgColor, FontSize, LineHeight } from "client/themes/constants";
import { AutoSizer, List } from "react-virtualized";

interface StdoutProps {
  lines: string[];
}

export const Stdout: React.FC<StdoutProps> = ({ lines }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);

  const [stickedToBottom, setStickedToBottom] = useState(true);

  useLayoutEffect(() => {
    const wrapperNode = wrapperRef.current;
    if (!wrapperNode) {
      return;
    }
    if (stickedToBottom) {
      wrapperNode.scrollTop = wrapperNode.scrollHeight;
    }
  }, [lines, stickedToBottom]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      setStickedToBottom(true);
    } else {
      setStickedToBottom(false);
    }
  }, []);

  const theme = useContext(ThemeContext);

  return (
    <StyledPreWrapper ref={wrapperRef} onScroll={handleScroll}>
      <StyledPre>
        <AutoSizer>
          {size => {
            return (
              <List
                containerStyle={{ overflowX: "auto" }}
                autoContainerWidth
                ref={listRef}
                rowRenderer={({ index, style, key }) => (
                  <div key={key} style={style}>
                    {lines[index]}
                  </div>
                )}
                rowCount={lines.length}
                rowHeight={theme.lineHeights[LineHeight.S]}
                {...size}
              />
            );
          }}
        </AutoSizer>
      </StyledPre>
    </StyledPreWrapper>
  );
};

export const StyledPreWrapper = styled.div`
  flex: 1;
  max-width: 100%;
  border: 1px solid ${themeGet(`colors.${BgColor.Control}`)};
  margin-top: -1px;
  overflow: scroll;
`;

export const StyledPre = styled.pre`
  font-size: ${themeGet(`fontSizes.${FontSize.S}`)}px;
  line-height: ${themeGet(`lineHeights.${LineHeight.S}`)}px;
  position: relative;
  height: 100%;
  margin: 0;
`;
