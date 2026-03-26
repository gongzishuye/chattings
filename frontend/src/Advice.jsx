import './Advice.css'

const adviceContent = [
  {
    type: 'intro',
    text: '这不可笑，很正常。但本质上你在担心什么？你担心的不是她离开，是你觉得"配不上"。'
  },
  {
    type: 'problem',
    title: '根本问题在这儿：',
    text: '你觉得她优秀 = 你不够好。这逻辑本身就错了。\n\n她漂亮、赚钱多，那是她的价值。你担心她离开，说明你在用她的标准衡量自己。\n\n但关系不是比赛。谁赚钱多、谁更好看，从来不是长久吸引力的来源。'
  },
  {
    type: 'highlight',
    title: '真正让你有吸引力的是什么？',
    items: [
      '你在成长',
      '你有自己专注的事',
      '你的情绪稳定、有主见',
      '你让她觉得和你在一起有意思'
    ]
  },
  {
    type: 'action',
    title: '所以该怎么做？',
    text: '别把精力花在担心上。担心是最没用的事，消耗你，还改变不了任何事。',
    list: [
      { main: '让自己变得更好', sub: '不管是能力、认知还是收入' },
      { main: '找到你的独特价值', sub: '不是和她比，是做你自己' },
      { main: '经营这段关系', sub: '陪伴、理解、共同经历' }
    ]
  },
  {
    type: 'core',
    text: '你担心她离开，最有效的解法就是：让她觉得"这个人值得我留下"。\n\n不是靠卑微讨好，是靠你自己的成长和吸引力。'
  },
  {
    type: 'worst',
    title: '最坏的结果是什么？',
    text: '她真的走了。\n\n那你该做的也是让自己变得更好，然后找到真正合适的人。\n\n而不是现在这样，一边担心，一边什么都不做。'
  },
  {
    type: 'conclusion',
    text: '担心不解决任何问题。\n成长才解决。'
  }
]

function Advice() {
  return (
    <div className="advice-page">
      <div className="advice-card">
        <header className="advice-header">
          <span className="advice-icon">💙</span>
          <h1>关于你的担心</h1>
        </header>

        <div className="advice-body">
          {adviceContent.map((section, index) => {
            switch (section.type) {
              case 'intro':
                return (
                  <p key={index} className="advice-intro">
                    {section.text}
                  </p>
                )

              case 'problem':
                return (
                  <div key={index} className="advice-section problem">
                    <h2>{section.title}</h2>
                    {section.text.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )

              case 'highlight':
                return (
                  <div key={index} className="advice-section highlight">
                    <h2>{section.title}</h2>
                    <ul>
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )

              case 'action':
                return (
                  <div key={index} className="advice-section action">
                    <h2>{section.title}</h2>
                    <p className="action-intro">{section.text}</p>
                    <div className="action-list">
                      {section.list.map((item, i) => (
                        <div key={i} className="action-item">
                          <span className="action-num">{i + 1}</span>
                          <div>
                            <strong>{item.main}</strong>
                            <span>{item.sub}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )

              case 'core':
                return (
                  <div key={index} className="advice-section core">
                    {section.text.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )

              case 'worst':
                return (
                  <div key={index} className="advice-section worst">
                    <h2>{section.title}</h2>
                    {section.text.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )

              case 'conclusion':
                return (
                  <div key={index} className="advice-conclusion">
                    {section.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )

              default:
                return null
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default Advice
