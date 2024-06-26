import React from "react";
import Validation from "../../../../../../shared/validation";
import { configuration } from "../../../../../../config/companyConfig";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { differenceInDays } from "date-fns";
import validate from '../../../../../../shared/validation'
import HTMLView from 'react-native-htmlview';
import {
  View,
  ScrollView,
  TouchableNativeFeedback,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text,Item } from 'native-base';
import MetaInfo from "../../../../../../shared/getMetaInfo";

export default function DenseTable(props) {

  let rows = [];
  const { task, tasksList, project } = props;

 
  const taskId =props.taskId;
  let Uselabels = project[0].useLabels;
  const projectLabels = Object.values(project[0].labels).filter(
    (e) => e.isExist
  );
  tasksList.forEach((task) => {
    if (task.taskId === taskId) rows.push(task);
  });
  let taskList = tasksList;
  dayjs.extend(relativeTime);
  const diff = dayjs();
  const getDueBy = (enddate, status) => {
    if (status === "Completed" || status === "Closed") return false;
    return new Date() - new Date(enddate) >= 0 ? true : false;
  };
  const formatter = (date) => {
    let final = "";
    try {
      final = Intl.DateTimeFormat(
        configuration["date-code"],
        configuration.dateformat
      ).format(new Date(date));
    } catch (error) {
      final = date;
    }
    return final;
  };
  
  const metaInfo = new MetaInfo();
  dayjs.extend(relativeTime);

  const formatDueBy = (enddate, status) => {
    if (getDueBy(enddate, status)) {
      const days = differenceInDays(
        new Date().setHours(0, 0, 0, 0),
        new Date(enddate).setHours(0, 0, 0, 0)
      );
      if (days === 1) return days.toString() + " day";
      return days.toString() + " days";
    }
    return "---";
  };
  let data = [];
  // const projectLabels = state.projectList.filter(item => item.id === state.project.id)[0].labels
  rows &&
    rows.forEach((task) => {
      data.push({
        title: task.title,
        id: task.id,
        cid: task.cid,
        startdate: task.startdate,
        enddate: task.enddate,
        status: task.status,
        description:task.description,
        assignee:
          task.assignee && task.assignee.map((e) => metaInfo.emailToName(e)),
        createdByName: metaInfo.emailToName(task.createdBy),
        type: task.type,
        labels: projectLabels.filter(
          (item) => task.labels && task.labels.includes(item.id)
        ),
        createdBy: task.createdBy,
        projectTaskId: project[0].cid + " - " + task.cid,
        category: task.category,
        priority: task.priority,
        taskId: task.category === "subtask" ? task.taskId : "",
        dueby: formatDueBy(task.enddate, task.status),
        projectId: project[0].id,
      });
    });
    
  if (rows.length > 0)
    return (
      <>
        <FlatList
          data={data}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
              style={styles.container}
              activeOpacity={0.95}>
              <View style={styles.labelContainer1}>
              <View>
              <View
                style={{
                  borderRadius: 16,
                  backgroundColor: 'rgb(246,245,248)',
                }}>
                <TouchableOpacity>
                  <Text style={styles.labelText}>{item.priority}</Text>
                </TouchableOpacity>
              </View>
          </View>       
                {item.type === 'Task' ? (
                  <View style={{borderRadius: 16, backgroundColor: '#17a2b8'}}>
                    <TouchableOpacity
                      >
                      <Text style={styles.labelText1}>Task</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{borderRadius: 16, backgroundColor: '#db2828'}}>
                    <TouchableOpacity
                     >
                      <Text style={styles.labelText1}>Bug</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={styles.labelContainer}>
                <View style={styles.labelTextContainer}>
                  <TouchableOpacity
                    >
                    <Text style={styles.labelText}>
                      {item.projectTaskId
                        ? item.projectTaskId
                        : props.cid + '-' + item.cid}
                    </Text>
                  </TouchableOpacity>
                </View>
                {item.status === 'Open' ? (
                  <View style={{borderRadius: 16, backgroundColor: '#21ba45'}}>
                    <TouchableOpacity
                     >
                      <Text style={styles.labelText1}>Open</Text>
                    </TouchableOpacity>
                  </View>
                ) : item.status === 'InProgress' ? (
                  <View style={{borderRadius: 16, backgroundColor: '#f78a14'}}>
                    <TouchableOpacity
                      >
                      <Text style={styles.labelText1}>In Progress</Text>
                    </TouchableOpacity>
                  </View>
                ) : item.status === 'Closed' ? (
                  <View style={{borderRadius: 16, backgroundColor: '#d9534f'}}>
                    <TouchableOpacity
                     >
                      <Text style={styles.labelText1}>Closed</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{borderRadius: 16, backgroundColor: 'grey'}}>
                    <TouchableOpacity
                     >
                      <Text style={styles.labelText1}>{item.status}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
        
              <View style={styles.mainTextContainer}>
                <Text style={styles.mainText}>{item.title}</Text>
              </View>
              <View style={styles.authorWrapper}>
                <TouchableOpacity
                  style={styles.authorContainer}
                  >
                  <View style={styles.footerContainer}>
                    <Text style={styles.authorName}>
                      {validate.dateFormatter(item.startdate) +
                        '   |   ' +
                        validate.dateFormatter(item.enddate)}
                    </Text>
                  </View>
                  <View style={{paddingTop:5,flexDirection:'row'}}>
            <Text style={{color:'grey'}}>Description : {' '}</Text>
            {
              item.description ?  <HTMLView value={item.description} style={{maxWidth:180}} />
              : <Text style={{color:'grey'}}>-----</Text>
            }
         
            </View>
                </TouchableOpacity>
                <View style={styles.authorBlankContainer} />
              </View>
            </TouchableOpacity>
            );
          }}
         
        
        />
      </>
    )

  return (
    <View style={{alignItems: 'center',margin:50}}>
      <Text>No data</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    width:'98%',
    shadowColor: 'rgb(35,35,35)',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 40,
    shadowOpacity: 0.08,
   // width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf:'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: Platform.select({ ios: 0, android: 2 }),
    borderColor: 'rgb(246,245,248)',
  },
  labelTextContainer: {
   // backgroundColor: 'rgb(246,245,248)',
    borderRadius: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  labelTextContainer: {
    backgroundColor: 'rgb(246,245,248)',
    borderRadius: 16,
  },
  labelText: {
    fontSize: 12,
    lineHeight: 16,
    color: 'rgb(71,71,71)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    
  },
  labelText1: {
    fontSize: 12,
    lineHeight: 16,
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4, 
  },
  labelContainer1: {
    flexDirection: 'row',
    marginBottom:10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 8,
    shadowColor: 'rgb(35,35,35)',
    shadowOffset: {
      width: 0,
      heght: 2,
    },
    shadowRadius: 32,
    shadowOpacity: 0.016,
    backgroundColor: 'rgb(246,245,248)',
   // width: 56,
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
  },
  number: {
    color: 'white',
    paddingLeft: 5,
    fontSize: 16,
    lineHeight: 20,
    
  },
  mainText: {
    fontSize: 24,
    lineHeight: 28,
    color: 'black',
    letterSpacing: -0.2,
    paddingTop: 8,
    
  },
  mainTextContainer: {},
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 22,
  },
  authorPhoto: {
    width: 24,
    height: 24,
    borderRadius:  50
  },
  authorName: {
    fontSize: 12,
    lineHeight: 16,
    color: 'grey',
    
  },
  authorWrapper: {
    flexDirection: 'row',
  },
  authorContainer: {
    paddingRight: 40,
  },
  authorBlankContainer: {
    width: '38%',
  },
  iconCardElement: {
    paddingLeft: 8,
  },
});