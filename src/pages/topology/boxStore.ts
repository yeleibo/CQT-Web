import ChaoqianService from '@/pages/topology/chaoqianService';
import {
  BoxPortStatus,
  BoxPortType,
  ChaoqianBoxDto,
  ChaoqianBoxPortDto,
} from '@/pages/topology/type';
import { makeAutoObservable, runInAction } from 'mobx';

class BoxStore {
  allBox: ChaoqianBoxDto[] = [];
  fatBoxCable: ChaoqianBoxDto[] = [];
  hubBoxCable: ChaoqianBoxDto[] = [];
  subBoxCable: ChaoqianBoxDto[] = [];
  parentBoxes: ChaoqianBoxDto[] = [];
  childrenBoxes: ChaoqianBoxDto[] = [];
  oltBoxes: ChaoqianBoxDto[] = [];
  boxInfo?: ChaoqianBoxDto = undefined;
  onu?: ChaoqianBoxDto = undefined;
  showCard: boolean = false;
  showOnu: boolean = false;
  isHaveOLT: boolean = false;
  chaoqianBoxPortDto?: ChaoqianBoxPortDto = undefined;
  portStatusColor: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  async fetchChaoqianTopology(areaId: number, boxId: number, isOnu: boolean) {
    try {
      let params = { areaId, boxId };
      const boxData = await ChaoqianService.getChaoqianTopology(params);
      runInAction(() => {
        this.allBox = boxData.boxes;
      });
      this.groupBoxes(isOnu, boxId);
    } catch (error) {
      console.error('Failed to fetch Chaoqian topology', error);
    }
  }

  checkBox(checkedBox: ChaoqianBoxDto) {
    const getParentBox = (inPort: ChaoqianBoxPortDto) => {
      const oppositePortId = inPort.oppositePortId;
      const parentBox = this.allBox.find((boxItem) =>
        boxItem.chaoqianBoxPorts.some(
          (port) => port.id === oppositePortId && port.id !== inPort.id,
        ),
      );
      if (parentBox) {
        runInAction(() => {
          this.parentBoxes.push(parentBox);
        });
        if (parentBox.type === 'OLT') {
          return;
        } else {
          const inputPort = parentBox.chaoqianBoxPorts.find(
            (element) => element.type === BoxPortType.input,
          );
          if (inputPort) {
            getParentBox(inputPort);
          }
        }
      }
    };

    const getChildrenBox = (box: ChaoqianBoxDto) => {
      const cascadePort = box.chaoqianBoxPorts.find(
        (element) => element.type === BoxPortType.cascade,
      );
      if (!cascadePort || cascadePort.oppositePortId === undefined) {
        return;
      }

      const boxId = cascadePort.id;
      const childrenBox = this.allBox.find(
        (boxItem) =>
          boxItem.chaoqianBoxPorts.some((port) => port.oppositePortId === boxId) &&
          box.id !== boxItem.id,
      );
      if (childrenBox) {
        runInAction(() => {
          this.childrenBoxes.push(childrenBox);
        });
        getChildrenBox(childrenBox);
      }
    };

    const input1 = checkedBox.chaoqianBoxPorts.find(
      (element) => element.oppositePortId !== undefined && element.type === BoxPortType.input,
    );

    if (input1) {
      getParentBox(input1);
    }

    getChildrenBox(checkedBox);
  }

  showLine(box: ChaoqianBoxDto) {
    runInAction(() => {
      this.hubBoxCable = this.hubBoxCable.map((hubBox) => ({
        ...hubBox,
        isShowFatBox: hubBox.id === box.id,
      }));
    });
  }

  showOutContainer(box: ChaoqianBoxDto, chaoqianBoxPortDto: ChaoqianBoxPortDto) {
    runInAction(() => {
      if (box.type === 'OLT') {
        const newOltBoxes = [...this.oltBoxes];
        const hubBoxes = [...this.hubBoxCable];
        const allBoxes = [...hubBoxes];

        allBoxes.forEach((box) => {
          box.chaoqianBoxPorts.forEach((port) => {
            port.isOuterContainerBorderVisible = false;
          });
        });
        this.hubBoxCable = allBoxes.filter((element) => element.type === 'HubBox');

        newOltBoxes.forEach((oltBox) => {
          oltBox.chaoqianBoxPorts.forEach((port) => {
            port.isOuterContainerBorderVisible = port.id === chaoqianBoxPortDto.id;
          });
        });

        this.oltBoxes = newOltBoxes;
      } else {
        const newOltBoxes = [...this.oltBoxes];
        const hubBoxes = [...this.hubBoxCable];
        const allBoxes = [...newOltBoxes];

        allBoxes.forEach((box) => {
          box.chaoqianBoxPorts.forEach((port) => {
            port.isOuterContainerBorderVisible = false;
          });
        });
        this.oltBoxes = allBoxes.filter((element) => element.type === 'OLT');

        hubBoxes.forEach((hubBox) => {
          hubBox.chaoqianBoxPorts.forEach((port) => {
            port.isOuterContainerBorderVisible = port.id === chaoqianBoxPortDto.id;
          });
        });

        this.hubBoxCable = hubBoxes;
      }
    });
  }

  closeOutContainer() {
    runInAction(() => {
      const newOltBoxes = [...this.oltBoxes];
      const hubBoxes = [...this.hubBoxCable];

      newOltBoxes.forEach((oltBox) => {
        oltBox.chaoqianBoxPorts.forEach((port) => {
          port.isOuterContainerBorderVisible = false;
        });
      });
      this.oltBoxes = newOltBoxes;

      hubBoxes.forEach((hubBox) => {
        hubBox.chaoqianBoxPorts.forEach((port) => {
          port.isOuterContainerBorderVisible = false;
        });
      });
      this.hubBoxCable = hubBoxes;
    });
  }

  closeLine() {
    runInAction(() => {
      this.hubBoxCable = this.hubBoxCable.map((hubBox) => ({
        ...hubBox,
        isShowFatBox: false,
      }));
    });
  }

  showOnuEvent(onu: ChaoqianBoxDto) {
    runInAction(() => {
      this.onu = onu;
      this.showOnu = true;
      this.showCard = false;
    });
  }

  showCardEvent(card: ChaoqianBoxDto) {
    runInAction(() => {
      this.showCard = true;
      this.showOnu = false;
      this.boxInfo = card;
    });
  }

  hideOnu() {
    runInAction(() => {
      this.showOnu = false;
    });
  }

  hideCard() {
    runInAction(() => {
      this.showCard = false;
    });
  }

  showPortStatusColor(chaoqianBoxPortDto: ChaoqianBoxPortDto) {
    runInAction(() => {
      if (chaoqianBoxPortDto.status === BoxPortStatus.linked) {
        this.portStatusColor = 'green';
      } else if (chaoqianBoxPortDto.status === BoxPortStatus.error) {
        this.portStatusColor = 'red';
      } else {
        this.portStatusColor = 'black';
      }
    });
  }

  pointPort(box: ChaoqianBoxDto, chaoqianBoxPortDto: ChaoqianBoxPortDto) {
    const subBoxes = this.allBox.filter(
      (element) => element.type === 'SubBox' || element.type === 'EndBox',
    );
    const hubBoxes = this.allBox.filter((element) => element.type === 'HubBox');
    this.hideCard();
    this.hideOnu();

    const getChildrenFatBox = (chaoqianBoxPortDto: ChaoqianBoxPortDto) => {
      if (chaoqianBoxPortDto.oppositePortId === undefined) {
        return;
      }
      const boxId = chaoqianBoxPortDto.id;
      const allFatBoxes = [...subBoxes];
      const childrenBox = allFatBoxes.find(
        (boxItem) =>
          boxItem.chaoqianBoxPorts.find((element) => element.type === BoxPortType.input)!
            .oppositePortId === boxId,
      );
      if (childrenBox) {
        runInAction(() => {
          this.subBoxCable.push(childrenBox);
        });
        if (childrenBox.chaoqianBoxPorts.some((element) => element.type === BoxPortType.cascade)) {
          getChildrenFatBox(
            childrenBox.chaoqianBoxPorts.find((element) => element.type === BoxPortType.cascade)!,
          );
        }
      }
    };

    const getChildrenHubBoxes = (chaoqianBoxPortDto: ChaoqianBoxPortDto) => {
      if (chaoqianBoxPortDto.oppositePortId === undefined) {
        return;
      }
      const boxId = chaoqianBoxPortDto.id;

      const childrenBox = hubBoxes.find(
        (e) =>
          e.chaoqianBoxPorts.find((element) => element.type === BoxPortType.input)!
            .oppositePortId === boxId,
      );
      if (childrenBox) {
        runInAction(() => {
          this.hubBoxCable.push(childrenBox);
        });
        // getChildrenHubBoxes(childrenBox.chaoqianBoxPorts
        //     .singleWhere((element) => element.type == BoxPortType.cascade));
      }
    };

    if (box.type === 'OLT') {
      this.closeLine();
      runInAction(() => {
        this.hubBoxCable = [];
        this.subBoxCable = [];
        this.fatBoxCable = [];
      });
      if (chaoqianBoxPortDto.oppositePortId === undefined) {
        return;
      }

      // 对ODBC Boxes的处理注释掉的代码块可以参考：
      // for (let i = 0; i < this.odbcBoxes.length; i++) {
      //   var odbcBox = this.odbcBoxes[i].chaoqianBoxPorts.find((element) =>
      //     element.oppositePortId == chaoqianBoxPortDto.id &&
      //     element.type == BoxPortType.input);
      //   if (odbcBox != null) {
      //     runInAction(() => {
      //       this.odcbBoxes.push(this.odbcBoxes[i]);
      //     });
      //     break;
      //   }
      // }
      // getChildrenHubBoxes(this.hubBoxCable[this.hubBoxCable.length - 1].chaoqianBoxPorts
      //     .find((element) => element.type == BoxPortType.cascade));
    } else {
      const isHaveFatBox = subBoxes.some(
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
        runInAction(() => {
          this.subBoxCable = [];
        });
        this.closeLine();
        return;
      }
      if (chaoqianBoxPortDto.oppositePortId !== null) {
        this.showLine(box);
        runInAction(() => {
          this.chaoqianBoxPortDto = chaoqianBoxPortDto;
        });
      }
      runInAction(() => {
        this.subBoxCable = [];
      });

      for (const subBox of subBoxes) {
        if (
          subBox.chaoqianBoxPorts.find((element) => element.type === BoxPortType.input)!
            .oppositePortId === chaoqianBoxPortDto.id
        ) {
          runInAction(() => {
            this.subBoxCable.push(subBox);
          });
          break;
        }
      }
      const cascade = this.subBoxCable[this.subBoxCable.length - 1].chaoqianBoxPorts.find(
        (element) => element.type === BoxPortType.cascade,
      );
      if (cascade) {
        getChildrenFatBox(cascade);
      }
    }
  }

  groupBoxes(isOnu: boolean, boxId: number) {
    const subBoxes = this.allBox.filter((box) => box.type === 'SubBox' || box.type === 'EndBox');
    const onus = this.allBox.filter((box) => box.type === 'ONU');
    runInAction(() => {
      this.fatBoxCable = [];
      this.hubBoxCable = [];
      this.subBoxCable = [];
      this.oltBoxes = [];
      this.parentBoxes = [];
      this.childrenBoxes = [];
    });

    const selectedBox = isOnu
      ? subBoxes.find((element) =>
          element.chaoqianBoxPorts.some(
            (element1) =>
              element1.cableCode ===
              onus.find((element2) => element2.id === boxId)?.chaoqianBoxPorts[0].cableCode,
          ),
        )
      : this.allBox.find((element) => element.id === boxId);

    if (selectedBox) {
      this.checkBox(selectedBox);

      if (selectedBox.type === 'SubBox' || selectedBox.type === 'EndBox') {
        const hubBox = this.parentBoxes.filter((element) => element.type === 'HubBox')[0];
        const lastSubBox = this.parentBoxes.filter((element) => element.type === 'SubBox');
        const subBox =
          this.parentBoxes.filter((element) => element.type === 'SubBox').length === 0
            ? selectedBox
            : lastSubBox[lastSubBox.length - 1];
        this.showLine(hubBox);
        this.showOutContainer(
          hubBox,
          hubBox.chaoqianBoxPorts.find(
            (element) =>
              element.cableCode ===
              subBox.chaoqianBoxPorts.find((element) => element.type === BoxPortType.input)!
                .cableCode,
          )!,
        );
        runInAction(() => {
          this.chaoqianBoxPortDto = selectedBox.chaoqianBoxPorts.find(
            (element) => element.type === BoxPortType.input,
          );
        });
      }

      if (selectedBox.type === 'OLT' || selectedBox.type === 'HubBox') {
        this.closeOutContainer();
      }

      const showBoxes = [...this.parentBoxes.reverse(), selectedBox, ...this.childrenBoxes];

      for (const box of showBoxes) {
        switch (box.type) {
          case 'OLT':
            runInAction(() => {
              this.oltBoxes.push(box);
            });
            break;
          case 'SubBox':
            runInAction(() => {
              this.subBoxCable.push(box);
            });
            break;
          case 'HubBox':
            runInAction(() => {
              this.hubBoxCable.push(box);
            });
            break;
          case 'FB':
            runInAction(() => {
              this.fatBoxCable.push(box);
            });
            break;
          case 'EndBox':
            runInAction(() => {
              this.subBoxCable.push(box);
            });
            break;
        }
      }

      if (this.subBoxCable.length !== 0) {
        this.showPortStatusColor(
          this.subBoxCable[0].chaoqianBoxPorts.find(
            (element) => element.type === BoxPortType.input,
          )!,
        );
      }

      if (this.oltBoxes.length !== 0) {
        runInAction(() => {
          this.isHaveOLT = true;
        });
      }
      if (selectedBox.type === 'OLT' || selectedBox.type === 'HubBox') {
        this.closeLine();
      }

      // 展示详情
      if (isOnu) {
        this.showOnuEvent(onus.find((element) => element.id === boxId)!);
      } else {
        this.showCardEvent(selectedBox);
      }
    }
  }
}

export default new BoxStore();
