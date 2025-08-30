import { formatDate, formatTime, formatScore } from './helpers'

// WhatsApp sharing utilities
export const whatsappShare = {
  // Share championship information
  championship: (championship, teams = []) => {
    let message = `🏆 *${championship.name}*\n`
    message += `📅 Temporada ${championship.season}\n\n`
    
    if (teams.length > 0) {
      message += `👥 *${teams.length} times participando:*\n`
      teams.forEach((team, index) => {
        message += `${index + 1}. ${team.name}\n`
      })
      message += '\n'
    }
    
    message += `🔥 Acompanhe os jogos e resultados!\n\n`
    message += `⚽ *Futebol de Várzea*`
    
    return openWhatsApp(message)
  },

  // Share standings table
  standings: (championship, standings) => {
    let message = `🏆 *${championship.name}*\n`
    message += `📊 *CLASSIFICAÇÃO*\n\n`
    
    standings.slice(0, 10).forEach((team, index) => {
      const position = index + 1
      const trophy = position === 1 ? '👑' : position <= 3 ? '🥉' : '  '
      
      message += `${trophy} ${position}º ${team.name}\n`
      message += `   ${team.points}pts • ${team.played}J • SG: ${team.gd > 0 ? '+' : ''}${team.gd}\n\n`
    })
    
    message += `⚽ *Futebol de Várzea*`
    
    return openWhatsApp(message)
  },

  // Share match information
  match: (match, homeTeam, awayTeam, championship) => {
    let message = `⚽ *${championship?.name || 'Futebol de Várzea'}*\n\n`
    
    // Match header
    message += `🆚 *${homeTeam.name}* vs *${awayTeam.name}*\n\n`
    
    // Score or scheduled time
    if (match.status === 'finished') {
      message += `📊 *RESULTADO FINAL*\n`
      message += `${formatScore(match.scoreHome, match.scoreAway)}\n\n`
      
      // Goals if available
      if (match.goals && match.goals.length > 0) {
        message += `⚽ *GOLS:*\n`
        match.goals.forEach(goal => {
          const team = goal.teamId === homeTeam.id ? homeTeam.name : awayTeam.name
          message += `${goal.minute}' ${goal.playerName} (${team})\n`
        })
        message += '\n'
      }
    } else if (match.status === 'live') {
      message += `🔴 *AO VIVO*\n`
      message += `${formatScore(match.scoreHome || 0, match.scoreAway || 0)}\n\n`
    } else {
      message += `📅 *PRÓXIMO JOGO*\n`
      message += `${formatDate(match.date)} às ${formatTime(match.date)}\n\n`
    }
    
    message += `⚽ *Futebol de Várzea*`
    
    return openWhatsApp(message)
  },

  // Share multiple matches (round/week)
  matchRound: (matches, round, championship) => {
    let message = `🏆 *${championship.name}*\n`
    message += `🗓️ *${round}ª RODADA*\n\n`
    
    matches.forEach(match => {
      message += `⚽ ${match.homeTeam} x ${match.awayTeam}\n`
      
      if (match.status === 'finished') {
        message += `   ${formatScore(match.scoreHome, match.scoreAway)} ✅\n`
      } else {
        message += `   ${formatDate(match.date)} - ${formatTime(match.date)}\n`
      }
      message += '\n'
    })
    
    message += `⚽ *Futebol de Várzea*`
    
    return openWhatsApp(message)
  },

  // Share top scorers
  topScorers: (championship, scorers) => {
    let message = `🏆 *${championship.name}*\n`
    message += `👑 *ARTILHEIROS*\n\n`
    
    scorers.slice(0, 10).forEach((scorer, index) => {
      const position = index + 1
      const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}º`
      
      message += `${medal} ${scorer.name}\n`
      message += `   ${scorer.goals} gol${scorer.goals !== 1 ? 's' : ''} • ${scorer.teamName}\n\n`
    })
    
    message += `⚽ *Futebol de Várzea*`
    
    return openWhatsApp(message)
  },

  // Share club invitation
  clubInvite: (clubName, athleteName) => {
    let message = `⚽ *CONVITE PARA JOGAR!*\n\n`
    message += `🏟️ O clube *${clubName}* quer você no time!\n\n`
    message += `👤 Atleta: ${athleteName}\n\n`
    message += `✅ Entre no app e aceite o convite para fazer parte do elenco!\n\n`
    message += `⚽ *Futebol de Várzea*`
    
    return openWhatsApp(message)
  },

  // Share championship invitation for clubs
  championshipInvite: (championshipName, clubName, organizationName) => {
    let message = `🏆 *CONVITE PARA CAMPEONATO!*\n\n`
    message += `📋 *${championshipName}*\n`
    message += `🏟️ Clube: ${clubName}\n`
    message += `👔 Organização: ${organizationName}\n\n`
    message += `📝 Sua inscrição foi aceita!\n`
    message += `🎯 Prepare o time para a competição!\n\n`
    message += `⚽ *Futebol de Várzea*`
    
    return openWhatsApp(message)
  },

  // Generic share function
  custom: (title, content, footer = '⚽ Futebol de Várzea') => {
    let message = ''
    
    if (title) {
      message += `*${title}*\n\n`
    }
    
    message += content
    
    if (footer) {
      message += `\n\n${footer}`
    }
    
    return openWhatsApp(message)
  }
}

// Helper function to open WhatsApp with message
const openWhatsApp = (message) => {
  try {
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/?text=${encodedMessage}`
    
    // Try to use Web Share API first (better mobile experience)
    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      navigator.share({
        title: 'Futebol de Várzea',
        text: message
      }).catch(() => {
        // Fallback to WhatsApp URL
        window.open(url, '_blank', 'noopener,noreferrer')
      })
    } else {
      // Desktop or Web Share API not supported
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    
    return true
  } catch (error) {
    console.error('Error sharing to WhatsApp:', error)
    
    // Ultimate fallback - copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).then(() => {
        alert('Mensagem copiada! Cole no WhatsApp para compartilhar.')
      })
    } else {
      alert('Não foi possível compartilhar automaticamente. Copie a mensagem manualmente.')
    }
    
    return false
  }
}

// Helper function to check if device supports WhatsApp sharing
export const canShareToWhatsApp = () => {
  // Check if on mobile device
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  // Check if WhatsApp is likely installed (on mobile)
  if (isMobile) {
    return true
  }
  
  // Desktop - WhatsApp Web should work
  return true
}

// Share button component props helper
export const getShareButtonProps = (type, data) => {
  const baseProps = {
    className: "inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors",
    title: "Compartilhar no WhatsApp"
  }

  switch (type) {
    case 'championship':
      return {
        ...baseProps,
        onClick: () => whatsappShare.championship(data.championship, data.teams),
        children: "📱 Compartilhar Campeonato"
      }
      
    case 'standings':
      return {
        ...baseProps,
        onClick: () => whatsappShare.standings(data.championship, data.standings),
        children: "📊 Compartilhar Classificação"
      }
      
    case 'match':
      return {
        ...baseProps,
        onClick: () => whatsappShare.match(data.match, data.homeTeam, data.awayTeam, data.championship),
        children: "⚽ Compartilhar Jogo"
      }
      
    default:
      return baseProps
  }
}

export default whatsappShare