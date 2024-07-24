import { CurlyBrackets3Painter, LineCanvasWithText } from '@/pages/topology/CurlyBrackets';
import ChaoqianService from '@/pages/topology/chaoqianService';
import {
  BoxPortStatus,
  BoxPortType,
  ChaoqianBoxDto,
  ChaoqianBoxPortDto,
  ChaoqianTopologyParam,
} from '@/pages/topology/type';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import './topology.scss';

interface TopologyProp {
  boxId: number;
  areaId: number;
  isOnu: boolean;
}

const TopologyPage: React.FC<TopologyProp> = (props) => {
  const [allBox, setAllBox] = useState<ChaoqianBoxDto[]>([]);
  const [fatBoxCable, setFatBoxCable] = useState<ChaoqianBoxDto[]>([]);
  const [hubBoxCable, setHubBoxCable] = useState<ChaoqianBoxDto[]>([]);
  const [subBoxCable, setSubBoxCable] = useState<ChaoqianBoxDto[]>([]);
  const [parentBoxes, setParentBoxes] = useState<ChaoqianBoxDto[]>([]);
  const [childrenBoxes, setChildrenBoxes] = useState<ChaoqianBoxDto[]>([]);
  const [oltBoxes, setOltBoxes] = useState<ChaoqianBoxDto[]>([]);
  const [boxInfo, setBoxInfo] = useState<ChaoqianBoxDto>();
  const [onu, setOnu] = useState<ChaoqianBoxDto>();
  const [showCard, setShowCard] = useState<boolean>(false);
  const [showOnu, setShowOnu] = useState<boolean>(false);
  const [isHaveOLT, setIsHaveOLT] = useState<boolean>(false);
  const [chaoqianBoxPortDto, setChaoqianBoxPortDto] = useState<ChaoqianBoxPortDto>();
  const [portStatusColor, setPortStatusColor] = useState<string>('black');
  const [borderColor, setBorderColor] = useState<string>('transparent');

  //递归寻找盒子的上下级
  const checkBox = (checkedBox: ChaoqianBoxDto) => {
    function getParentBox(inPort: ChaoqianBoxPortDto) {
      let oppositePortId = inPort.oppositePortId;
      let parentBox = allBox.find((boxItem) =>
        boxItem.chaoqianBoxPorts.some(
          (port) => port.id === oppositePortId && port.id !== inPort.id,
        ),
      );
      if (parentBox !== undefined) {
        setParentBoxes([...parentBoxes, parentBox]);
        if (parentBox.type === 'OLT') {
          return;
        } else {
          let inputPort = parentBox.chaoqianBoxPorts.find(
            (element) => element.type === BoxPortType.input,
          );
          if (inputPort !== undefined) {
            getParentBox(inputPort);
          }
        }
      }
    }

    ///找的是盒子的级联盒子。例如盒子是HubBox，只会找与它连接的下一级HubBox,不需要找FatBox
    function getChildrenBox(box: ChaoqianBoxDto) {
      ///FatEndBox是最后一个，不需要找下级盒子。当盒子是XBox，只会显示OLT设备和XBox,不需要找下一级
      // if (box.type !== 'SubBox') {
      //   return;
      // }

      ///当盒子的cascade为null，没有下一级
      if (
        box.chaoqianBoxPorts.find((element) => element.type === BoxPortType.cascade)!
          .oppositePortId === undefined
      ) {
        return;
      }

      let boxId = box.chaoqianBoxPorts.find((element) => element.type === BoxPortType.cascade)!.id;
      let childrenBox = allBox.find(
        (boxItem) =>
          boxItem.chaoqianBoxPorts.some((port) => port.oppositePortId === boxId) &&
          box.id !== boxItem.id,
      );
      if (childrenBox !== undefined) {
        setChildrenBoxes([...childrenBoxes, childrenBox]);
        getChildrenBox(childrenBox);
      }
    }

    let input1 = checkedBox.chaoqianBoxPorts.find(
      (element) => element.oppositePortId !== undefined && element.type === BoxPortType.input,
    );

    if (input1 !== undefined) {
      getParentBox(input1);
    }

    getChildrenBox(checkedBox);
  };

  const showLine = (box: ChaoqianBoxDto) => {
    let hubBoxes = [...hubBoxCable];

    for (let i = 0; i < hubBoxes.length; i++) {
      hubBoxes[i].isShowFatBox = hubBoxes[i].id === box.id;
    }
    setHubBoxCable(hubBoxes);
  };

  const showOutContainer = (box: ChaoqianBoxDto, chaoqianBoxPortDto: ChaoqianBoxPortDto) => {
    if (box.type === 'OLT') {
      let newOltBoxes = [...oltBoxes];
      let hubBoxes = [...hubBoxCable];
      // var odbcBoxes = List.of(state.odcbBoxes);
      let allBoxes = [...hubBoxes];
      for (let i = 0; i < allBoxes.length; i++) {
        for (let element of allBoxes[i].chaoqianBoxPorts) {
          element.isOuterContainerBorderVisible = false;
        }
        setHubBoxCable(allBoxes.filter((element) => element.type === 'HubBox'));
      }
      for (let i = 0; i < newOltBoxes.length; i++) {
        for (let j = 0; j < newOltBoxes[i].chaoqianBoxPorts.length; j++) {
          newOltBoxes[i].chaoqianBoxPorts[j].isOuterContainerBorderVisible =
            newOltBoxes[i].chaoqianBoxPorts[j].id === chaoqianBoxPortDto.id;
        }
      }
      setOltBoxes([...newOltBoxes]);
    } else {
      let newOltBoxes = [...oltBoxes];
      let hubBoxes = [...hubBoxCable];
      let allBoxes = [...newOltBoxes];
      for (let i = 0; i < allBoxes.length; i++) {
        for (let element of allBoxes[i].chaoqianBoxPorts) {
          element.isOuterContainerBorderVisible = false;
        }
        setOltBoxes(allBoxes.filter((element) => element.type === 'OLT'));
      }
      for (let i = 0; i < hubBoxes.length; i++) {
        for (let j = 0; j < hubBoxes[i].chaoqianBoxPorts.length; j++) {
          hubBoxes[i].chaoqianBoxPorts[j].isOuterContainerBorderVisible =
            hubBoxes[i].chaoqianBoxPorts[j].id === chaoqianBoxPortDto.id;
        }
      }
      setHubBoxCable([...hubBoxes]);
    }
  };

  const closeOutContainer = () => {
    let newOltBoxes = [...oltBoxes];
    let hubBoxes = [...hubBoxCable];
    for (let i = 0; i < newOltBoxes.length; i++) {
      for (let element of newOltBoxes[i].chaoqianBoxPorts) {
        element.isOuterContainerBorderVisible = false;
      }

      setOltBoxes([...newOltBoxes]);
    }
    for (let i = 0; i < hubBoxes.length; i++) {
      for (let element of hubBoxes[i].chaoqianBoxPorts) {
        element.isOuterContainerBorderVisible = false;
      }
      setHubBoxCable([...hubBoxes]);
    }
  };

  const closeLine = () => {
    let hubBoxes = [...hubBoxCable];
    for (let element of hubBoxes) {
      element.isShowFatBox = false;
    }
    setHubBoxCable([...hubBoxes]);
  };

  const showOnuEvent = (onu: ChaoqianBoxDto) => {
    setOnu(onu);
    setShowOnu(true);
    setShowCard(false);
  };

  const showCardEvent = (card: ChaoqianBoxDto) => {
    setShowCard(true);
    setShowOnu(false);
    setBoxInfo(card);
  };

  const hideOnu = () => {
    setShowOnu(false);
  };
  const hideCard = () => {
    setShowCard(false);
  };

  const showPortStatusColor = (chaoqianBoxPortDto: ChaoqianBoxPortDto) => {
    if (chaoqianBoxPortDto.status === BoxPortStatus.linked) {
      setPortStatusColor('green');
    } else if (chaoqianBoxPortDto.status === BoxPortStatus.error) {
      setPortStatusColor('red');
    } else {
      setPortStatusColor('black');
    }
  };

  const pointPort = (box: ChaoqianBoxDto, chaoqianBoxPortDto: ChaoqianBoxPortDto) => {
    let subBoxes = allBox.filter(
      (element) => element.type === 'SubBox' || element.type === 'EndBox',
    );
    let hubBoxes = allBox.filter((element) => element.type === 'HubBox');
    let oltBoxes = allBox.filter((element) => element.type === 'OLT');
    hideCard();
    hideOnu();

    ///点击hubBox的端口，获取与之相连的FatBox
    function getChildrenFatBox(chaoqianBoxPortDto: ChaoqianBoxPortDto) {
      if (chaoqianBoxPortDto.oppositePortId === undefined) {
        return;
      }
      let boxId = chaoqianBoxPortDto.id;
      let allFatBoxes = [...subBoxes];
      let childrenBox = allFatBoxes.find(
        (boxItem) =>
          boxItem.chaoqianBoxPorts.find((element) => element.type === BoxPortType.input)!
            .oppositePortId === boxId,
      );
      if (childrenBox !== undefined) {
        setSubBoxCable([...subBoxCable, childrenBox]);
        if (childrenBox.chaoqianBoxPorts.some((element) => element.type === BoxPortType.cascade)) {
          getChildrenFatBox(
            childrenBox.chaoqianBoxPorts.find((element) => element.type === BoxPortType.cascade)!,
          );
        }
      }
    }

    ///点击OLT的端口。获取与之相连有联系的HubBox
    function getChildrenHubBoxes(chaoqianBoxPortDto: ChaoqianBoxPortDto) {
      if (chaoqianBoxPortDto.oppositePortId === undefined) {
        return;
      }
      let boxId = chaoqianBoxPortDto.id;

      let childrenBox = hubBoxes.find(
        (e) =>
          e.chaoqianBoxPorts.find((element) => element.type === BoxPortType.input)!
            .oppositePortId === boxId,
      );
      if (childrenBox !== undefined) {
        setHubBoxCable([...hubBoxCable, childrenBox]);
        // getChildrenHubBoxes(childrenBox.chaoqianBoxPorts
        //     .singleWhere((element) => element.type == BoxPortType.cascade));
      }
    }

    if (box.type === 'OLT') {
      ///隐藏所有HubBox和FatBox之间的连接线
      closeLine();
      setHubBoxCable([]);
      setSubBoxCable([]);
      setFatBoxCable([]);
      if (chaoqianBoxPortDto.oppositePortId === undefined) {
        return null;
      }

      ///寻找与该出口连接的odbc
      // for (let i = 0; i < odbcBoxes.length; i++) {
      //   var odbcBox = odbcBoxes[i].chaoqianBoxPorts.singleOrDefault((element) =>
      //     element.oppositePortId == event.chaoqianBoxPortDto.id &&
      //     element.type == BoxPortType.input);
      //   if (odbcBox != null) {
      //     emit(state.copyWith(odcbBoxes: [...state.odcbBoxes, odbcBoxes[i]]));
      //     break;
      //   }
      // }
      // getChildrenHubBoxes(state.hubBoxCable.last.chaoqianBoxPorts
      //     .singleWhere((element) => element.type == BoxPortType.cascade));
    } else {
      let isHaveFatBox = subBoxes.some(
        (element) =>
          element.chaoqianBoxPorts.find((element1) => element1.type === BoxPortType.input)!
            .oppositePortId === chaoqianBoxPortDto.id,
      );
      if (
        chaoqianBoxPortDto.type === BoxPortType.cascade ||
        chaoqianBoxPortDto.type === BoxPortType.input ||
        chaoqianBoxPortDto.oppositePortId === undefined ||
        !isHaveFatBox
      ) {
        setSubBoxCable([]);
        closeLine();
        return;
      }
      if (chaoqianBoxPortDto.oppositePortId !== null) {
        showLine(box);
        setChaoqianBoxPortDto(chaoqianBoxPortDto);
      }
      setSubBoxCable([]);

      for (let i = 0; i < subBoxes.length; i++) {
        if (
          subBoxes[i].chaoqianBoxPorts.find((element) => element.type === BoxPortType.input)!
            .oppositePortId === chaoqianBoxPortDto.id
        ) {
          setSubBoxCable([...subBoxCable, subBoxes[i]]);
          break;
        }
      }
      let cascade = subBoxCable[subBoxCable.length - 1].chaoqianBoxPorts.find(
        (element) => element.type === BoxPortType.cascade,
      );
      if (cascade !== undefined) {
        getChildrenFatBox(cascade);
      }
    }
  };

  const groupBoxes = (isOnu: boolean, boxId: number) => {
    let subBoxes = allBox.filter((box) => box.type === 'SubBox' || box.type === 'EndBox');
    let onus = allBox.filter((box) => box.type === 'ONU');
    setFatBoxCable([]);
    setHubBoxCable([]);
    setSubBoxCable([]);
    setOltBoxes([]);
    setParentBoxes([]);
    setChildrenBoxes([]);
    let selectedBox = isOnu
      ? subBoxes.find((element) =>
          element.chaoqianBoxPorts.some(
            (element1) =>
              element1.cableCode ===
              onus.find((element2) => element2.id === boxId)?.chaoqianBoxPorts[0].cableCode,
          ),
        )
      : allBox.find((element) => element.id === boxId);

    checkBox(selectedBox!);

    if (selectedBox!.type === 'SubBox' || selectedBox!.type === 'EndBox') {
      let hubBox = parentBoxes.filter((element) => element.type === 'HubBox')[0];
      let lastSubBox = parentBoxes.filter((element) => element.type === 'SubBox');
      let subBox =
        parentBoxes.filter((element) => element.type === 'SubBox').length === 0
          ? selectedBox
          : lastSubBox[lastSubBox.length - 1];
      showLine(hubBox);
      showOutContainer(
        hubBox,
        hubBox.chaoqianBoxPorts.find(
          (element) =>
            element.cableCode ===
            subBox!.chaoqianBoxPorts.find((element) => element.type === BoxPortType.input)!
              .cableCode,
        )!,
      );
      setChaoqianBoxPortDto(
        selectedBox!.chaoqianBoxPorts.find((element) => element.type === BoxPortType.input),
      );
    }

    if (selectedBox!.type === 'OLT' || selectedBox!.type === 'HubBox') {
      closeOutContainer();
    }

    let showBoxes = [...parentBoxes.reverse(), selectedBox!, ...childrenBoxes];

    for (let box of showBoxes) {
      switch (box.type) {
        case 'OLT':
          setOltBoxes([...oltBoxes, box]);
          break;
        case 'SubBox':
          setSubBoxCable([...subBoxCable, box]);
          break;
        case 'HubBox':
          setHubBoxCable([...hubBoxCable, box]);
          break;
        // case 'ODCB':
        //   emit(state.copyWith(odcbBoxes: [...state.odcbBoxes, box]));
        case 'FB':
          setFatBoxCable([...fatBoxCable, box]);
          break;
        case 'EndBox':
          setSubBoxCable([...subBoxCable, box]);
          break;
      }
    }
    if (subBoxCable.length !== 0) {
      showPortStatusColor(
        subBoxCable[0].chaoqianBoxPorts.find((element) => element.type === BoxPortType.input)!,
      );
    }

    if (oltBoxes.length !== 0) {
      setIsHaveOLT(true);
    }
    if (selectedBox!.type === 'OLT' || selectedBox!.type === 'HubBox') {
      closeLine();
    }

    ///展示详情
    if (isOnu) {
      showOnuEvent(onus.find((element) => element.id === boxId)!);
    } else {
      showCardEvent(selectedBox!);
    }
  };

  useEffect(() => {
    let params: ChaoqianTopologyParam = {
      areaId: props.areaId,
      boxId: props.boxId,
    };
    ChaoqianService.getChaoqianTopology(params).then((boxData) => {
      setAllBox(boxData.boxes);
      groupBoxes(props.isOnu, props.boxId);
    });
  }, []);

  //最外层框
  const outerContainerStyle: React.CSSProperties = {
    width: '225px', // 增加宽度以容纳 LineCanvasWithText 组件
    height: '400px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  //虚线框样式
  const dottedStyle: React.CSSProperties = {
    border: '2px dashed black',
    borderRadius: '20px',
    width: '200px',
    height: '375px',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  };

  //线框上的小球
  const topRightCircleStyle: React.CSSProperties = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'green',
    position: 'absolute',
    top: '50px',
    right: '0',
  };

  //包含端口的框
  const listStyle: React.CSSProperties = {
    marginTop: '20px',
    height: '150px',
    width: '180px',
    marginBottom: '-30px',
    overflowY: 'auto',
  };

  // @ts-ignore
  const PortOuterContainer = ({ borderColor, children }) => {
    // 使用传入的变量来设置样式
    const portOuterContainerStyle = {
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      border: `1px solid ${borderColor}`, // 使用变量来设置边框颜色
      backgroundColor: 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };

    return <div style={portOuterContainerStyle}>{children}</div>;
  };

  //端口圆圈
  const portCircleStyle: React.CSSProperties = {
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    backgroundColor: 'blue',
    margin: 'auto', // 设置你的颜色
  };

  //盒子标志的外层框
  const boxContainerStyle: React.CSSProperties = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: '#d3d3d3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const imageStyle: React.CSSProperties = {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: 'red',
  };

  //卡片样式
  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    width: '80%',
    bottom: '0px',
    left: '30px',
    right: '30px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transform: 'translateX(-50%)',
    borderRadius: '10px',
  };

  //拓扑图的最外框
  const topologyStyle: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
  };

  return (
    <div style={topologyStyle}>
      <CurlyBrackets3Painter chaoqianBoxPortDto={[]}></CurlyBrackets3Painter>
      <div className={`outer-container ${true ? 'show-line' : ''}`}>
        <div style={dottedStyle}>
          <div style={boxContainerStyle}>
            <div style={imageStyle}></div>
          </div>
          <div style={{ height: '10px' }}></div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              alignItems: 'center',
              marginBottom: '10px',
              justifyContent: 'center',
            }}
          >
            OLT
          </div>
          <div style={listStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '11px' }}>
              {[...Array(8)].map((_, index) => (
                <PortOuterContainer key={index} borderColor={borderColor}>
                  <div
                    key={index}
                    style={portCircleStyle}
                    onClick={() => {
                      setBorderColor('green');
                    }}
                  ></div>
                </PortOuterContainer>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '-10px' }}>
            <div style={{ fontWeight: 'bold' }}>Device Name: Example</div>
            <div style={{ fontWeight: 'bold' }}>Code: 12345</div>
          </div>
        </div>
        <div style={topRightCircleStyle}></div>
        <div style={{ position: 'absolute', left: 'calc(100%)', top: '15px' }}>
          <LineCanvasWithText></LineCanvasWithText>
        </div>
      </div>
      {showCard && (
        <div style={cardStyle}>
          <Card size={'default'} bordered={false} />
        </div>
      )}
    </div>
  );
};

export default TopologyPage;
