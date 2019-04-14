import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { themeGet } from "styled-system";
import { BgColor, FontSize, LineHeight } from "client/themes/constants";
import {
  AutoSizer,
  List,
  CellMeasurer,
  CellMeasurerCache,
  OnScrollParams
} from "react-virtualized";

const cellMeasurerCacheMap = new Map<string, CellMeasurerCache>();

function getCacheByName(name: string) {
  if (cellMeasurerCacheMap.has(name)) {
    return cellMeasurerCacheMap.get(name)!;
  }
  const cache = new CellMeasurerCache({
    defaultHeight: 18,
    fixedWidth: true
  });
  cellMeasurerCacheMap.set(name, cache);
  return cache;
}

interface StdoutProps {
  lines: string[];
  name: string;
}

export const Stdout: React.FC<StdoutProps> = ({ lines, name }) => {
  const [stickedToBottom, setStickedToBottom] = useState(false);

  const handleScroll = useCallback((params: OnScrollParams) => {
    if (params.clientHeight + params.scrollTop >= params.scrollHeight) {
      setStickedToBottom(true);
    } else {
      setStickedToBottom(false);
    }
  }, []);

  const cache = getCacheByName(name);

  return (
    <StyledPreWrapper>
      <StyledPre>
        <AutoSizer>
          {size => (
            <List
              autoContainerWidth
              deferredMeasurementCache={cache}
              rowRenderer={({ index, style, key, parent }) => (
                <CellMeasurer
                  cache={cache}
                  columnIndex={0}
                  key={key}
                  parent={parent}
                  rowIndex={index}
                >
                  <div style={style}>{lines[index]}</div>
                </CellMeasurer>
              )}
              rowCount={lines.length}
              rowHeight={cache.rowHeight}
              scrollToIndex={stickedToBottom ? lines.length - 1 : undefined}
              onScroll={handleScroll}
              {...size}
            />
          )}
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
  white-space: pre-wrap;
  height: 100%;
  margin: 0;
`;
